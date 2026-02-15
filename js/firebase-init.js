import { initializeApp, getApps } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0HLb1TVf3vJCQEQr2pUOonoXoKnjbrtw",
  authDomain: "login-65d4b.firebaseapp.com",
  projectId: "login-65d4b",
  storageBucket: "login-65d4b.appspot.com",
  messagingSenderId: "239979806578",
  appId: "1:239979806578:web:65db25b7e975ef0f1867eb"
};

/* Prevent double initialization */
const app = getApps().length === 0 
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const auth = getAuth(app);

/* Keep session persistent */
await setPersistence(auth, browserLocalPersistence);

export { auth };
