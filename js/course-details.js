import { db } from "./firebase.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const title = document.getElementById("courseTitle");
const description = document.getElementById("courseDescription");
const video = document.getElementById("courseVideo");

async function loadCourse() {
  const snap = await getDoc(doc(db, "courses", id));

  if (snap.exists()) {
    const data = snap.data();
    title.innerText = data.title;
    description.innerText = data.description;
    video.src = data.video;
  }
}

loadCourse();
