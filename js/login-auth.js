import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  // your config
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const selectedRole = document.getElementById("role").value;
  const errorMessage = document.getElementById("errorMessage");

  errorMessage.textContent = "";

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      errorMessage.textContent = "User data missing.";
      return;
    }

    const actualRole = userDoc.data().role;

    // 🔴 ROLE MISMATCH CHECK
    if (actualRole !== selectedRole) {
      errorMessage.textContent = "You are not allowed to login as " + selectedRole;
      await auth.signOut();   // Important
      return;                 // STOP redirect
    }

    // ✅ ROLE BASED REDIRECT
    if (actualRole === "admin") {
      window.location.href = "admin-analytics.html";
    } 
    else if (actualRole === "teacher") {
      window.location.href = "dashboard.html";
    } 
    else {
      window.location.href = "dashboard.html";
    }

  } catch (error) {
    errorMessage.textContent = error.message;
  }
});
