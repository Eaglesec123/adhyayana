import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { 
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

const form = document.querySelector(".signup-form");
const googleBtn = document.getElementById("googleSignup");

form.addEventListener("submit", async (e)=>{
  e.preventDefault();

  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const role = document.getElementById("signupRole").value;

  try {

    const userCred = await createUserWithEmailAndPassword(auth,email,password);

    await setDoc(doc(db,"users",userCred.user.uid),{
      name:name,
      email:email,
      role:role,
      createdAt:serverTimestamp()
    });

    window.location.replace("dashboard.html");

  } catch(err){
    alert(err.message);
  }
});

/* GOOGLE SIGNUP */
googleBtn.addEventListener("click", async ()=>{

  try {

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const userRef = doc(db,"users",result.user.uid);
    const snap = await getDoc(userRef);

    if(!snap.exists()){
      await setDoc(userRef,{
        name:result.user.displayName,
        email:result.user.email,
        role:"student",
        createdAt:serverTimestamp()
      });
    }

    window.location.replace("dashboard.html");

  } catch(err){
    alert(err.message);
  }

});
