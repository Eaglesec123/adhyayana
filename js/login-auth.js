import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { 
  getAuth, 
  signInWithEmailAndPassword,
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
const provider = new GoogleAuthProvider();


document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");
  const googleBtn = document.getElementById("googleLogin");
  const errorMessage = document.getElementById("errorMessage");


  /* ==========================
     EMAIL + PASSWORD LOGIN
  ===========================*/
  if (form) {
    form.addEventListener("submit", async (e) => {

      e.preventDefault();
      errorMessage.innerText = "";

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {

        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        const snap = await getDoc(doc(db, "users", user.uid));

        if (!snap.exists()) {
          errorMessage.innerText = "User data not found.";
          return;
        }

       const role = snap.data().role;

// Ignore dropdown completely

if (role === "student") {
  window.location.href = "dashboard.html";
} 
else if (role === "teacher") {
  window.location.href = "admin-analytics.html";
}


      } catch (error) {
        console.error(error);
        errorMessage.innerText = error.message;
      }

    });
  }


  /* ==========================
        GOOGLE LOGIN
  ===========================*/
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {

      try {

        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        // If first time login → create student account
        if (!snap.exists()) {
          await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            role: "student",
            createdAt: Date.now()
          });
        }

        const updatedSnap = await getDoc(userRef);
        const role = updatedSnap.data().role;

        if (role === "student") {
          window.location.href = "dashboard.html";
        } 
        else if (role === "teacher" || role === "admin") {
          window.location.href = "admin-analytics.html";
        }

      } catch (error) {
        console.error("Google Login Error:", error);
        errorMessage.innerText = error.message;
      }

    });
  }

});

