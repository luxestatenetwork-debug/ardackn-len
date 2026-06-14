import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already done
if (!admin.apps.length) {
  try {
    // If service account JSON is supplied in environment, use it
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      // Fallback to application default credentials (ADC) or environmental defaults
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      });
    }
  } catch (e) {
    console.error("Firebase admin init error: ", e);
  }
}

const db = admin.firestore();

export async function POST(req) {
  try {
    const payload = await req.json();
    console.log("Received Gumroad Webhook via Next API:", JSON.stringify(payload));

    const email = payload.email;
    const saleId = payload.sale_id;
    const price = payload.price; // in cents
    const productName = payload.product_name;
    const isRefund = payload.refunded === "true" || payload.refunded === true;
    
    let userId = null;
    
    // Check parameters
    if (payload.url_params && payload.url_params.userId) {
      userId = payload.url_params.userId;
    } else if (payload.custom_fields && payload.custom_fields.userId) {
      userId = payload.custom_fields.userId;
    }

    // Try finding user by email
    if (!userId && email) {
      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("email", "==", email).limit(1).get();
      if (!snapshot.empty) {
        userId = snapshot.docs[0].id;
      } else {
        try {
          const userRecord = await admin.auth().getUserByEmail(email);
          userId = userRecord.uid;
        } catch (authErr) {
          console.error("User not found by email in Auth or Firestore:", email);
        }
      }
    }

    if (!userId) {
      console.warn("No user found matching webhook payload details.");
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const userRef = db.collection("users").doc(userId);
    const paymentRef = db.collection("payments").doc(saleId || `payment_${Date.now()}`);

    if (isRefund) {
      await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        
        let currentSlots = 0;
        let premium = false;
        
        if (userDoc.exists) {
          const data = userDoc.data();
          currentSlots = data.slots_purchased || 0;
          premium = data.premium || false;
        }

        const newSlots = Math.max(0, currentSlots - 5);
        const newPremiumStatus = newSlots > 0;

        transaction.set(userRef, {
          slots_purchased: newSlots,
          premium: newPremiumStatus,
          isPremium: newPremiumStatus,
          role: newPremiumStatus ? "owner" : "investor",
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        transaction.set(paymentRef, {
          userId,
          email,
          gumroadSaleId: saleId,
          amount: -(price / 100),
          status: "refunded",
          productName,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      return NextResponse.json({ message: "Refund processed successfully" }, { status: 200 });
    }

    // Purchase - Increment slots by 3
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      let currentSlots = 0;
      if (userDoc.exists) {
        currentSlots = userDoc.data().slots_purchased || 0;
      }
      const newSlots = currentSlots + 5;

      transaction.set(userRef, {
        slots_purchased: newSlots,
        premium: true,
        isPremium: true,
        role: "owner",
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      transaction.set(paymentRef, {
        userId,
        email,
        gumroadSaleId: saleId,
        amount: price / 100,
        status: "completed",
        productName,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Add dynamic notification
      const notificationRef = db.collection("notifications").doc();
      transaction.set(notificationRef, {
        userId,
        type: "payment",
        message: `Payment successful! 5 slots added. Total: ${newSlots}.`,
        read: false,
        link: "/dashboard/listings",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    return NextResponse.json({ message: "Purchase processed successfully" }, { status: 200 });

  } catch (error) {
    console.error("Next API Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
