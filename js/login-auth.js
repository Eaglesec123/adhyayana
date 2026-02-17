import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc,
  getAuth, 
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

