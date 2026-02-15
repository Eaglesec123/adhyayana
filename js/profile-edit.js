import { auth, db } from "./firebase.js";
import { doc, getDoc, setDoc }
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const CLOUD_NAME = "dlqbfsh92";
const UPLOAD_PRESET = "v8kfswiw";

let currentUser;

document.addEventListener("DOMContentLoaded", function () {

  const profilePreview = document.getElementById("profilePreview");
  const photoInput = document.getElementById("photoInput");
  const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");

  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");

  const viewMode = document.getElementById("viewMode");
  const editMode = document.getElementById("editMode");

  /* AUTH */
  onAuthStateChanged(auth, async (user) => {

    if (!user) {
      alert("Please login first");
      return;
    }

    currentUser = user;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        category: "",
        skills: "",
        address: "",
        photoURL: ""
      });
    }

    const data = (await getDoc(userRef)).data();

    document.getElementById("viewName").innerText = user.email;
    document.getElementById("viewEmail").innerText = user.email;

    document.getElementById("viewCategory").innerText = data.category || "";
    document.getElementById("viewSkills").innerText = data.skills || "";
    document.getElementById("viewAddress").innerText = data.address || "";

    document.getElementById("editCategory").value = data.category || "";
    document.getElementById("editSkills").value = data.skills || "";
    document.getElementById("editAddress").value = data.address || "";

    if (data.photoURL) {
      profilePreview.src = data.photoURL;
    }
  });

  /* TOGGLE EDIT */
  editBtn.addEventListener("click", () => {
    viewMode.classList.toggle("hidden");
    editMode.classList.toggle("hidden");
  });

  /* SAVE PROFILE */
  saveBtn.addEventListener("click", async () => {

    await setDoc(doc(db, "users", currentUser.uid), {
      category: document.getElementById("editCategory").value,
      skills: document.getElementById("editSkills").value,
      address: document.getElementById("editAddress").value
    }, { merge: true });

    alert("Profile Updated!");
    location.reload();
  });

  /* OPEN FILE PICKER */
  uploadPhotoBtn.addEventListener("click", () => {
    photoInput.click();
  });

  /* UPLOAD IMAGE TO CLOUDINARY */
  photoInput.addEventListener("change", async function () {

    const file = this.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();
      console.log(data);

      if (data.secure_url) {

        profilePreview.src = data.secure_url;

        await setDoc(doc(db, currentUser.uid ? "users" : "", currentUser.uid), {
          photoURL: data.secure_url
        }, { merge: true });

        alert("Photo Uploaded Successfully!");

      } else {
        alert("Upload failed!");
      }

    } catch (error) {
      console.error(error);
      alert("Upload error!");
    }

  });

});
