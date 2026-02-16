import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
}
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

    const cred = await createUserWithEmailAndPassword(auth,email,password);

    // 🔥 Save role in Firestore
    await setDoc(doc(db,"users",cred.user.uid),{
      email: email,
      role: selectedRole,
      createdAt: new Date()
    });

    sessionStorage.setItem("role", selectedRole);

    window.location.href = "dashboard.html";

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

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth,provider);

    const userRef = doc(db,"users",result.user.uid);
    const snap = await getDoc(userRef);

    // 🔥 If already registered
    if(snap.exists()){

      const existingRole = snap.data().role;

      if(existingRole !== selectedRole){
        await signOut(auth);
        errorMessage.textContent =
          "This email is already registered as " + existingRole;
        return;
      }

      sessionStorage.setItem("role", existingRole);
      window.location.href = "dashboard.html";
      return;
    }

    // 🔥 New Google user → Save role
    await setDoc(userRef,{
      email: result.user.email,
      role: selectedRole,
      createdAt: new Date()
    });

    sessionStorage.setItem("role", selectedRole);

    window.location.href = "dashboard.html";

  } catch(err){
    errorMessage.textContent = err.message;
  }

});
