import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { 
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const selectedRole = document.getElementById("role").value.trim().toLowerCase();
  const errorMessage = document.getElementById("errorMessage");

  errorMessage.textContent = "";

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      errorMessage.textContent = "User data missing.";
      await auth.signOut();
      return;
    }

    const actualRole = userDoc.data().role.toLowerCase();

    if (actualRole !== selectedRole) {
      errorMessage.textContent = "You are not allowed to login as " + selectedRole;
      await auth.signOut();
      return;
    }

    // Proper redirects
    if (actualRole === "admin") {
      window.location.replace("admin-analytics.html");
    } 
    else if (actualRole === "teacher") {
      window.location.replace("teacher-dashboard.html");
    } 
    else {
      window.location.replace("dashboard.html");
    }

  } catch (error) {
    errorMessage.textContent = error.message;
  }
});



