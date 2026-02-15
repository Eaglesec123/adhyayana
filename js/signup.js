import { auth } from "./auth.js";
import { createUserWithEmailAndPassword } from
"https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const form = document.querySelector(".signup-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.querySelector("input[type=email]").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("🎉 Account created successfully!");
    window.location.href = "login.html";
  } catch (error) {
    alert(error.message);
  }
});
