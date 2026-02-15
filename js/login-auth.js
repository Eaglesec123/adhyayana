import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { auth } from "./firebase.js";


// ✅ Email Login
document.querySelector(".login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    saveUser(userCredential.user);

    // redirect only ONCE
    window.location.replace("dashboard.html");

  } catch (error) {
    alert(error.message);
  }
});


// ✅ Google Login
const provider = new GoogleAuthProvider();

document.getElementById("googleLogin").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    saveUser(result.user);

    window.location.replace("dashboard.html");

  } catch (error) {
    alert(error.message);
  }
});


// ✅ Forgot Password
document.getElementById("forgotPassword").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;

  if (!email) {
    alert("Enter your email first");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent!");
  } catch (error) {
    alert(error.message);
  }
});


// ✅ Save user in localStorage
function saveUser(user){
  localStorage.setItem("currentUser", JSON.stringify({
    uid: user.uid,
    name: user.displayName || "User",
    photo: user.photoURL || "images/user.png",
    email: user.email
  }));
}
