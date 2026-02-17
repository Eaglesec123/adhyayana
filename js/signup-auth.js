import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { 
  getAuth, 
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail
} from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { 
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
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


document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector(".signup-form");

  if (!form) {
    console.error("Signup form not found");
    return;
  }

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const role = document.getElementById("signupRole").value;

    try {

      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.length > 0) {
        alert("This email is already registered. Please login.");
        return;
      }

      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("This email is already registered.");
        return;
      }

      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: role,
        createdAt: Date.now()
      });

      alert("Signup successful!");
      window.location.href = "login.html";

    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message);
    }

  });

});
