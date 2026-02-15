import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getAuth } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3zjqhI5AVHoQCV7hnhjxdyQCkwD9DWA8",
  authDomain: "test-40e4a.firebaseapp.com",
  projectId: "test-40e4a",
  storageBucket: "test-40e4a.appspot.com",
  messagingSenderId: "308217103743",
  appId: "1:308217103743:web:fe4a228bae143d0cbb064a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

