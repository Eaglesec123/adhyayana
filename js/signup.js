import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  fetchSignInMethodsForEmail
}
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* =========================
   FIREBASE CONFIG
========================= */

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


/* =========================
   ELEMENTS
========================= */

const form = document.getElementById("signupForm");
const googleBtn = document.getElementById("googleSignup");
const errorMessage = document.getElementById("errorMessage");


/* =========================
   EMAIL SIGNUP
========================= */

form.addEventListener("submit", async (e)=>{
  e.preventDefault();

  errorMessage.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const selectedRole = document.getElementById("signupRole").value;

  try {

    // 🔐 Role validation
    if(selectedRole !== "student" && selectedRole !== "teacher"){
      errorMessage.textContent = "Invalid role selected.";
      return;
    }

    // 🔐 Check if email already registered
    const methods = await fetchSignInMethodsForEmail(auth, email);

    if (methods.length > 0) {
      errorMessage.textContent =
        "This email is already registered. Please login.";
      return;
    }

    // 🔐 Create account
    const cred = await createUserWithEmailAndPassword(auth,email,password);

    // 🔐 Save role in Firestore
    await setDoc(doc(db,"users",cred.user.uid),{
      email: email,
      role: selectedRole,
      createdAt: serverTimestamp()
    });

    // Redirect after signup
    window.location.href = "login.html";

  } catch(err){
    errorMessage.textContent = err.message;
  }
});


/* =========================
   GOOGLE SIGNUP
========================= */

googleBtn.addEventListener("click", async ()=>{

  errorMessage.textContent = "";

  const selectedRole = document.getElementById("signupRole").value;

  try {

    // 🔐 Role validation
    if(selectedRole !== "student" && selectedRole !== "teacher"){
      errorMessage.textContent = "Invalid role selected.";
      return;
    }

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth,provider);

    const userRef = doc(db,"users",result.user.uid);
    const snap = await getDoc(userRef);

    // If already registered
    if(snap.exists()){
      await signOut(auth);
      errorMessage.textContent =
        "This email is already registered. Please login.";
      return;
    }

    // Save new Google user
    await setDoc(userRef,{
      email: result.user.email,
      role: selectedRole,
      createdAt: serverTimestamp()
    });

    window.location.href = "login.html";

  } catch(err){
    errorMessage.textContent = err.message;
  }

});
