import { auth } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

await setPersistence(auth, browserLocalPersistence);

/* NORMAL SIGNUP */

const form = document.querySelector(".signup-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      await updateProfile(user, { displayName: name });

      localStorage.setItem("currentUser", JSON.stringify({
        uid: user.uid,
        name: name,
        email: user.email,
        photo: user.photoURL || "images/user.png"
      }));

      window.location.href = "dashboard.html";

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
}

/* GOOGLE SIGNUP */

const googleBtn = document.getElementById("googleSignup");
const provider = new GoogleAuthProvider();

if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem("currentUser", JSON.stringify({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL
      }));

      window.location.href = "dashboard.html";

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
}
