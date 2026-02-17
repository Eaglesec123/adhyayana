import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { 
  getAuth,
  signInWithEmailAndPassword,
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

// --------------------
// EMAIL LOGIN
// --------------------
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
      await signOut(auth);
      return;
    }

    const role = userDoc.data().role.toLowerCase();

    if (role !== selectedRole) {
      errorMessage.textContent = "You are not allowed to login as " + selectedRole;
      await signOut(auth);
      return;
    }

    redirectUser(role);

  } catch (error) {
    errorMessage.textContent = error.message;
  }
});

// --------------------
// GOOGLE LOGIN
// --------------------
const provider = new GoogleAuthProvider();

document.getElementById("googleLogin").addEventListener("click", async () => {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.textContent = "";

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // First time Google user
      await setDoc(userRef, {
        email: user.email,
        role: "student"
      });

      window.location.replace("dashboard.html");
      return;
    }

    const role = userSnap.data().role.toLowerCase();
    redirectUser(role);

  } catch (error) {
    errorMessage.textContent = error.message;
  }
});

// --------------------
// REDIRECT FUNCTION
// --------------------
function redirectUser(role) {
  if (role === "admin") {
    window.location.replace("admin-analytics.html");
  } 
  else if (role === "teacher") {
    window.location.replace("teacher-dashboard.html");
  } 
  else {
    window.location.replace("dashboard.html");
  }
}
