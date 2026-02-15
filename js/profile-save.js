import { auth, db } from "./firebase.js";
import { doc, setDoc } from
"https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("Not logged in");
    return;
  }

  const profileData = {
    role: document.getElementById("role").value,
    category: document.getElementById("category").value,
    skills: document.getElementById("skills").value.split(",").map(s => s.trim()),
    address: document.getElementById("address").value,
    createdAt: new Date()
  };

  try {
    await setDoc(doc(db, "users", user.uid), profileData);
    window.location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
});
