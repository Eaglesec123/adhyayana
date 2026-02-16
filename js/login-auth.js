import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  setPersistence,
  browserSessionPersistence   // ✅ CHANGED HERE
} from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


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

/* ✅ FIX: Persistent login across pages */
await setPersistence(auth, browserLocalPersistence);

const form = document.getElementById("loginForm");
const googleBtn = document.getElementById("googleLogin");
const errorMessage = document.getElementById("errorMessage");


/* =========================
   EMAIL LOGIN
========================= */

form.addEventListener("submit", async (e)=>{
  e.preventDefault();

  errorMessage.textContent = "";
  localStorage.clear();   // ✅ use localStorage now

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

    if(realRole !== selectedRole){
      await signOut(auth);
      errorMessage.textContent =
        "Access denied! This email is registered as " + realRole;
      return;
    }

    /* ✅ SAVE ROLE PROPERLY */
    localStorage.setItem("role", realRole);
    localStorage.setItem("uid", cred.user.uid);

    if(realRole === "teacher"){
      window.location.href = "admin-analytics.html";
    } else {
      window.location.href = "dashboard.html";
    }

  } catch(err){
    errorMessage.textContent = err.message;
  }
});


/* =========================
   GOOGLE LOGIN
========================= */

googleBtn.addEventListener("click", async ()=>{

  errorMessage.textContent = "";
  localStorage.clear();

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

    if(realRole !== selectedRole){
      await signOut(auth);
      errorMessage.textContent =
        "Access denied! This email is registered as " + realRole;
      return;
    }

    /* ✅ SAVE ROLE PROPERLY */
    localStorage.setItem("role", realRole);
    localStorage.setItem("uid", result.user.uid);

    if(realRole === "teacher"){
      window.location.href = "admin-analytics.html";
    } else {
      window.location.href = "dashboard.html";
    }

  } catch(err){
    errorMessage.textContent = err.message;
  }

});

