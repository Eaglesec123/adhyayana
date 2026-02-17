import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { 
  getAuth, 
  signInWithEmailAndPassword 
} from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { 
  getFirestore, 
  doc, 
  getDoc 
} from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* 🔥 Firebase Config */
const firebaseConfig = {
  apiKey: "AIzaSyC0HLb1TVf3vJCQEQr2pUOonoXoKnjbrtw",
  authDomain: "login-65d4b.firebaseapp.com",
  projectId: "login-65d4b",
  storageBucket: "login-65d4b.appspot.com",
  messagingSenderId: "239979806578",
  appId: "1:239979806578:web:65db25b7e975ef0f1867eb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


/* 🚀 Login Form */
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage");

  form.addEventListener("submit", async (e) => {

    e.preventDefault();
    errorMessage.innerText = "";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // 🔥 Get real role from Firestore
      const snap = await getDoc(doc(db, "users", user.uid));

      if (!snap.exists()) {
        errorMessage.innerText = "User data not found.";
        return;
      }

      const role = snap.data().role;

      // ✅ Role-based redirect
      if (role === "student") {
        window.location.href = "dashboard.html";
      } 
      else if (role === "teacher" || role === "admin") {
        window.location.href = "admin-analytics.html";
      }

    } catch (error) {
      console.error(error);
      errorMessage.innerText = error.message;
    }

  });

});
