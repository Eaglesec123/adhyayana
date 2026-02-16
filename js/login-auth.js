import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  setPersistence,
  browserSessionPersistence
}
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* =========================
   FIREBASE CONFIG
========================= */

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

/* 🔥 Force session-only login */
await setPersistence(auth, browserSessionPersistence);

const form = document.getElementById("loginForm");
const googleBtn = document.getElementById("googleLogin");
const errorMessage = document.getElementById("errorMessage");


/* =========================
   EMAIL LOGIN
========================= */

form.addEventListener("submit", async (e)=>{
  e.preventDefault();

  errorMessage.textContent = "";
  sessionStorage.clear(); // clear old role

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const selectedRole = document.getElementById("loginRole").value;

  try {

    const cred = await signInWithEmailAndPassword(auth,email,password);

    const snap = await getDoc(doc(db,"users",cred.user.uid));

    if(!snap.exists()){
      await signOut(auth);
      errorMessage.textContent = "Account data not found.";
      return;
    }

    const realRole = snap.data().role;

    // 🔐 Strict role check
    if(realRole !== selectedRole){
      await signOut(auth);
      errorMessage.textContent =
        "Access denied! This email is registered as " + realRole;
      return;
    }

    sessionStorage.setItem("role", realRole);
    sessionStorage.setItem("uid", cred.user.uid);

    window.location.replace("dashboard.html");

  } catch(err){
    errorMessage.textContent = err.message;
  }
});


/* =========================
   GOOGLE LOGIN
========================= */

googleBtn.addEventListener("click", async ()=>{

  errorMessage.textContent = "";
  sessionStorage.clear(); // clear old session

  const selectedRole = document.getElementById("loginRole").value;

  try {

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth,provider);

    const snap = await getDoc(doc(db,"users",result.user.uid));

    if(!snap.exists()){
      await signOut(auth);
      errorMessage.textContent = "Account not registered. Please signup first.";
      return;
    }

    const realRole = snap.data().role;

    // 🔐 Strict role check
    if(realRole !== selectedRole){
      await signOut(auth);
      errorMessage.textContent =
        "Access denied! This email is registered as " + realRole;
      return;
    }

    sessionStorage.setItem("role", realRole);
    sessionStorage.setItem("uid", result.user.uid);

    window.location.replace("dashboard.html");

  } catch(err){
    errorMessage.textContent = err.message;
  }

});
