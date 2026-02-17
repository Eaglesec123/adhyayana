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
  projectId: "login-65d4b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


document.querySelector(".signup-form")
.addEventListener("submit", async (e) => {

  e.preventDefault();

  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const role = document.getElementById("signupRole").value;

  try {

    // 🔍 Check if email already exists in Firebase Auth
    const methods = await fetchSignInMethodsForEmail(auth, email);

    if (methods.length > 0) {
      alert("This email is already registered. Please login.");
      return;
    }

    // 🔍 Extra protection: check Firestore email duplication
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert("This email is already registered.");
      return;
    }

    // ✅ Create account
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    // Save role permanently
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      role: role, // saved once
      createdAt: Date.now()
    });

    alert("Signup successful!");
    window.location.href = "login.html";

  } catch (error) {
    alert(error.message);
  }

});
