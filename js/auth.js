import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from
"https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3zjqhI5AVHoQCV7hnhjxdyQCkwD9DWA8",
  authDomain: "test-40e4a.firebaseapp.com",
  projectId: "test-40e4a",
  appId: "1:308217103743:web:fe4a228bae143d0cbb064a"
};

// Init backend
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google backend
const provider = new GoogleAuthProvider();

const googleBtn = document.getElementById("googleLogin");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "index.html";
    } catch (err) {
      alert(err.message);
    }
  });
}
