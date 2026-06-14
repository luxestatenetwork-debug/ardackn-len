// testRegister.js
import { auth, db } from "./lib/firebase.js"; // correct relative path
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

(async () => {
  const email = `deneme${Date.now()}@example.com`;
  const password = "P@ssw0rd123";

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    console.log("✅ Auth oluşturuldu → UID:", cred.user.uid);

    const profile = {
      uid: cred.user.uid,
      email,
      displayName: "Deneme Kullanıcı",
      role: "investor",
      photoURL: "",
      premium: false,
      slots_purchased: 0,
      slots_used: 0,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", cred.user.uid), profile);
    console.log("✅ Firestore'a eklendi");
  } catch (e) {
    console.error("❌ Test kayıt hatası:", e);
  }
})();
