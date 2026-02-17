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
  getDoc,
  setDoc
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
const provider = new GoogleAuthProvider();


document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector(".signup-form");
  const googleBtn = document.getElementById("googleSignup");


  /* ========================
     EMAIL SIGNUP
  ========================*/
  if (form) {
    form.addEventListener("submit", async (e) => {

      e.preventDefault();

      const name = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const role = document.getElementById("signupRole").value;

      try {

        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          role,
          createdAt: Date.now()
        });

        alert("Signup successful!");
        window.location.href = "login.html";

      } catch (error) {
        alert(error.message);
      }

    });
  }


  /* ========================
     GOOGLE SIGNUP
  ========================*/
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {

      try {

        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        // If new Google user → create student account
        if (!snap.exists()) {
          await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            role: "student",  // default role
            createdAt: Date.now()
          });
        }

        // After Google signup → redirect
        window.location.href = "dashboard.html";

      } catch (error) {
        console.error("Google Signup Error:", error);
        alert(error.message);
      }

    });
  }

});
