import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
}
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
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

const form = document.getElementById("loginForm");
const googleBtn = document.getElementById("googleLogin");
const errorBox = document.getElementById("errorMessage");

/* EMAIL LOGIN */
form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  errorBox.innerText = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const selectedRole = document.getElementById("loginRole").value;

  try {

    const cred = await signInWithEmailAndPassword(auth,email,password);

    const userDoc = await getDoc(doc(db,"users",cred.user.uid));

    if(!userDoc.exists()){
      await signOut(auth);
      errorBox.innerText = "User role not found.";
      return;
    }

    const actualRole = userDoc.data().role;

    if(actualRole !== selectedRole){

      await signOut(auth);

      errorBox.innerText =
        "Access denied. You are registered as '" + actualRole + "'.";

      return;
    }

    // ✅ ONLY HERE redirect
    window.location.href = "dashboard.html";

  } catch(err){
    errorBox.innerText = err.message;
  }
});

/* GOOGLE LOGIN */
googleBtn.addEventListener("click", async ()=>{

  errorBox.innerText = "";

  try {

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const userDoc = await getDoc(doc(db,"users",result.user.uid));

    if(!userDoc.exists()){
      await signOut(auth);
      errorBox.innerText = "User role not found.";
      return;
    }

    window.location.href = "dashboard.html";

  } catch(err){
    errorBox.innerText = err.message;
  }
});
