import { auth } from "./firebase.js";
import { signOut } from
"https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
