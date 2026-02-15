import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const grid = document.getElementById("courseGrid");

async function loadCourses() {
  const querySnapshot = await getDocs(collection(db, "courses"));

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const card = document.createElement("div");
    card.className = "course-card";

    card.innerHTML = `
      <img src="${data.thumbnail}" alt="">
      <div class="course-info">
        <h4>${data.title}</h4>
        <p>${data.description.substring(0,100)}...</p>
      </div>
    `;

    card.onclick = () => {
      window.location.href =
        "course-details.html?id=" + doc.id;
    };

    grid.appendChild(card);
  });
}

loadCourses();
