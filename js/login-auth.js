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


/* ================= EMAIL LOGIN ================= */
form.addEventListener("submit", async (e)=>{
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const selectedRole = document.getElementById("loginRole").value;

  try {

    // 1️⃣ Sign in
    const cred = await signInWithEmailAndPassword(auth,email,password);

    // 2️⃣ Get stored role
    const userDoc = await getDoc(doc(db,"users",cred.user.uid));

    if(!userDoc.exists()){
      await signOut(auth);
      alert("User role not found.");
      return;
    }

    const actualRole = userDoc.data().role;

    // 3️⃣ STRICT ROLE BLOCK
    if(actualRole !== selectedRole){

      await signOut(auth);

      alert(
        "Access denied.\n" +
        "You registered as: " + actualRole
      );

      return; // 🚫 STOP — NO REDIRECT
    }

    // 4️⃣ Only correct role allowed
    window.location.href = "dashboard.html";

  } catch(err){
    alert(err.message);
  }
});


/* ================= GOOGLE LOGIN ================= */
googleBtn.addEventListener("click", async ()=>{

  try {

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const userDoc = await getDoc(doc(db,"users",result.user.uid));

    if(!userDoc.exists()){
      await signOut(auth);
      alert("User role not found.");
      return;
    }

    window.location.href = "dashboard.html";

  } catch(err){
    alert(err.message);
  }

});
