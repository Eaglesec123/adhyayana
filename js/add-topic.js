import { auth, db } from "./firebase.js";
import { addDoc, collection, serverTimestamp } from
"https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

document.getElementById("topicForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) return alert("Login required");

  await addDoc(collection(db, "topics"), {
    title: title.value,
    description: description.value,
    userId: user.uid,
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: serverTimestamp()
  });

  alert("Topic added successfully");
  window.location.href = "dashboard.html";
});
