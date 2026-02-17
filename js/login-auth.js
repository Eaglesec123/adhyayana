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
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
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

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      try {

        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        const snap = await getDoc(doc(db, "users", user.uid));

        if (!snap.exists()) {
          errorMessage.innerText = "User data not found.";
          return;
        }

        const role = snap.data().role;

        // 🔐 Redirect based on Firestore role
        if(role === "student"){
          window.location.href = "student-dashboard.html";
        }
        else if(role === "teacher"){
          window.location.href = "admin-dashboard.html";
        }
        else{
          errorMessage.innerText = "Invalid role.";
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

      errorMessage.innerText = "";

      try {

        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userRef = doc(db, "users", user.uid);
        let snap = await getDoc(userRef);

        // 🔥 If first time Google login → create student by default
        if (!snap.exists()) {

          await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            role: "student", // default role
            createdAt: Date.now()
          });

          snap = await getDoc(userRef);
        }

        const role = snap.data().role;

        // 🔐 Redirect based on saved role
        if(role === "student"){
          window.location.href = "student-dashboard.html";
        }
        else if(role === "teacher"){
          window.location.href = "admin-dashboard.html";
        }
        else{
          errorMessage.innerText = "Invalid role.";
        }

      } catch (error) {
        console.error("Google Login Error:", error);
        errorMessage.innerText = error.message;
      }

    });
  }

});
