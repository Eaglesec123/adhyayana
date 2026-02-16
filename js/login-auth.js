import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { 
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence
} from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { 
  getFirestore,
  doc,
  getDoc
} from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* ================= FIREBASE CONFIG ================= */

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

/* ================= FORCE LOGIN PERSISTENCE ================= */

await setPersistence(auth, browserLocalPersistence);

/* ================= EMAIL LOGIN ================= */

const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("loginRole").value;

  try {

    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    // Check role from Firestore
    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
      errorMessage.innerText = "User data missing.";
      return;
    }

    const userData = snap.data();

    if (userData.role !== role) {
      errorMessage.innerText = "Role mismatch!";
      return;
    }

    window.location = "dashboard.html";

  } catch (error) {
    errorMessage.innerText = error.message;
  }

});


/* ================= GOOGLE LOGIN ================= */

const googleBtn = document.getElementById("googleLogin");

googleBtn.addEventListener("click", async () => {

  try {

    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    window.location = "dashboard.html";

  } catch (error) {
    errorMessage.innerText = error.message;
  }

});
