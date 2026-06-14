const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * Gumroad Webhook Handler
 * Expects a POST request from Gumroad upon successful payment
 */
exports.gumroadWebhook = onRequest({ cors: true }, async (req, res) => {
  // Gumroad sends POST requests
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const payload = req.body;
    console.log("Received Gumroad Webhook:", JSON.stringify(payload));

    // Verify webhook signature if secret is configured (optional but recommended)
    // We check req.headers['x-gumroad-signature'] if we want, but for now we process the payload
    
    // Extract transaction details
    const email = payload.email;
    const saleId = payload.sale_id;
    const price = payload.price; // in cents
    const productName = payload.product_name;
    const isRefund = payload.refunded === "true" || payload.refunded === true;
    
    // Try to retrieve userId from custom fields or url parameters
    // In Gumroad, we can append user_id or userId to URL, which is returned in payload.url_params or payload.custom_fields
    let userId = null;
    
    if (payload.url_params && payload.url_params.userId) {
      userId = payload.url_params.userId;
    } else if (payload.custom_fields && payload.custom_fields.userId) {
      userId = payload.custom_fields.userId;
    }

    // If we don't have userId, look up user by email in Firestore
    if (!userId && email) {
      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("email", "==", email).limit(1).get();
      if (!snapshot.empty) {
        userId = snapshot.docs[0].id;
      } else {
        // Look up by auth email
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
      return res.status(400).send("User not found");
    }

    const userRef = db.collection("users").doc(userId);
    const paymentRef = db.collection("payments").doc(saleId || `payment_${Date.now()}`);

    // If this is a refund, revoke listing slots/premium status
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

      console.log(`Refund processed for user ${userId}. Subtracted 5 slots.`);
      return res.status(200).send("Refund processed successfully");
    }

    // Normal Purchase: Add 5 listing slots and upgrade role to owner
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      
      let currentSlots = 0;
      
      if (userDoc.exists) {
        const data = userDoc.data();
        currentSlots = data.slots_purchased || 0;
      }

      const newSlots = currentSlots + 5;

      transaction.set(userRef, {
        slots_purchased: newSlots,
        premium: true,
        isPremium: true,
        role: "owner", // Upgrade to Listing Owner role
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
      
      // Also add a system notification
      const notificationRef = db.collection("notifications").doc();
      transaction.set(notificationRef, {
        userId,
        type: "payment",
        message: `Payment successful! 5 listing slots have been added to your account. Current slots: ${newSlots}.`,
        read: false,
        link: "/dashboard/listings",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    console.log(`Purchase processed for user ${userId}. Added 5 slots. Total slots: ${newSlots}`);
    return res.status(200).send("Purchase processed successfully");

  } catch (error) {
    console.error("Error processing Gumroad Webhook:", error);
    return res.status(500).send("Internal Server Error");
  }
});
