import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
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

form.addEventListener("submit", async (e)=>{
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const selectedRole = document.getElementById("loginRole").value;

  try {

    const cred = await signInWithEmailAndPassword(auth,email,password);
    const snap = await getDoc(doc(db,"users",cred.user.uid));

    if(!snap.exists()){
      alert("User data not found.");
      return;
    }

    if(snap.data().role !== selectedRole){
      alert("Role mismatch. You registered as "+snap.data().role);
      return;
    }

    window.location.replace("dashboard.html");

  } catch(err){
    alert(err.message);
  }
});

googleBtn.addEventListener("click", async ()=>{
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth,provider);
    window.location.replace("dashboard.html");
  } catch(err){
    alert(err.message);
  }
});
