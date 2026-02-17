import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc 
} from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyC0HLb1TVf3vJCQEQr2pUOonoXoKnjbrtw",
  authDomain: "login-65d4b.firebaseapp.com",
  projectId: "login-65d4b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

document.getElementById("googleLogin")
.addEventListener("click", async () => {

  try {

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    // 🔥 If first time Google login → create user
    if (!snap.exists()) {

      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        role: "student",   // default role
        createdAt: Date.now()
      });

    }

    // Get updated user data
    const updatedSnap = await getDoc(userRef);
    const role = updatedSnap.data().role;

    // Redirect based on role
    if (role === "admin") {
      window.location.href = "admin-analytics.html";
    }
    else if (role === "teacher") {
      window.location.href = "admin-analytics.html";
    }
    else {
      window.location.href = "dashboard.html";
    }

  } catch (error) {

    console.error(error);
    document.getElementById("errorMessage").innerText =
      "Google login failed: " + error.message;

  }

});


