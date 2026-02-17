import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth, signInWithEmailAndPassword } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore, doc, getDoc } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyC0HLb1TVf3vJCQEQr2pUOonoXoKnjbrtw",
  authDomain: "login-65d4b.firebaseapp.com",
  projectId: "login-65d4b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


document.getElementById("loginForm")
.addEventListener("submit", async (e) => {

  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const selectedRole = document.getElementById("loginRole").value;
  const errorMessage = document.getElementById("errorMessage");

  try {

    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    // 🔥 Get REAL role from Firestore
    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
      errorMessage.innerText = "User data not found.";
      return;
    }

    const actualRole = snap.data().role;

    // 🚨 Compare selected role with actual role
    if (selectedRole !== actualRole) {

      await auth.signOut(); // logout immediately

      errorMessage.innerText =
        "Role mismatch! You are registered as " + actualRole + ".";

      return;
    }

    // ✅ Correct role — Redirect
    if (actualRole === "admin") {
      window.location.href = "admin-dashboard.html";
    }
    else if (actualRole === "teacher") {
      window.location.href = "teacher-dashboard.html";
    }
    else {
      window.location.href = "student-dashboard.html";
    }

  } catch (error) {
    errorMessage.innerText = error.message;
  }

});
