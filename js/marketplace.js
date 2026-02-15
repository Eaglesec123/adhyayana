import { db } from "./firebase.js";

import { 
  collection, 
  getDocs 
} from 
"https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const grid = document.getElementById("courseGrid");

async function loadCourses(){

  grid.innerHTML = "";

  const snapshot = await getDocs(collection(db,"courses"));

  if(snapshot.empty){
    grid.innerHTML = "<p>No courses available.</p>";
    return;
  }

  snapshot.forEach(doc=>{
    const data = doc.data();

    // Only show public courses
    if(data.visibility !== "public") return;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${data.thumbnail}">
      <div class="card-body">
        <div class="card-title">${data.title}</div>
        <div class="card-desc">${data.description}</div>
        <div class="rating">★★★★★</div>
        <div class="price">
          ${data.type === "free" ? "Free" : "₹" + data.price}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

}

loadCourses();
