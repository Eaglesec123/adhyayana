import { initializeApp } from 
"https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

import { getAuth, onAuthStateChanged } from 
"https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import { getFirestore, doc, getDoc, setDoc } from 
"https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* 🔹 Firebase Config */
const firebaseConfig = {
  apiKey: "AIzaSyC0HLb1TVf3vJCQEQr2pUOonoXoKnjbrtw",
  authDomain: "login-65d4b.firebaseapp.com",
  projectId: "login-65d4b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* 🔹 Cloudinary */
const CLOUD_NAME = "dlqbfsh92";
const UPLOAD_PRESET = "v8kfswiw";

let currentUser;

/* 🔹 DOM Elements */
const uploadBtn = document.getElementById("uploadBtn");
const photoInput = document.getElementById("photoInput");
const photoPreview = document.getElementById("photoPreview");

const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");

const viewBox = document.getElementById("viewBox");
const editBox = document.getElementById("editBox");

/* 🔹 Auth State */
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    alert("Please login first.");
    return;
  }

  console.log("Logged in user:", user.email);

  currentUser = user;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      category:"",
      skills:"",
      address:"",
      photoURL:""
    });
  }

  const data = (await getDoc(userRef)).data();

  document.getElementById("viewCategory").innerText = data.category || "";
  document.getElementById("viewSkills").innerText = data.skills || "";
  document.getElementById("viewAddress").innerText = data.address || "";

  document.getElementById("editCategory").value = data.category || "";
  document.getElementById("editSkills").value = data.skills || "";
  document.getElementById("editAddress").value = data.address || "";

  if(data.photoURL){
    photoPreview.src = data.photoURL;
  }

});

/* 🔹 Toggle Edit */
editBtn.onclick = () => {
  viewBox.style.display = "none";
  editBox.style.display = "block";
};

/* 🔹 Save Profile */
saveBtn.onclick = async () => {

  if(!currentUser) return;

  await setDoc(doc(db,"users",currentUser.uid),{
    category:document.getElementById("editCategory").value,
    skills:document.getElementById("editSkills").value,
    address:document.getElementById("editAddress").value
  },{merge:true});

  alert("Profile Saved!");
  location.reload();
};

/* 🔹 Open File Picker */
uploadBtn.onclick = () => {
  photoInput.click();
};

/* 🔹 Upload Image to Cloudinary */
photoInput.addEventListener("change", async function(){

  const file = this.files[0];
  if(!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "v8kfswiw");

  try {

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dlqbfsh92/image/upload",
      {
        method:"POST",
        body:formData
      }
    );

    const data = await response.json();
    console.log("Cloudinary:", data);

    if(data.secure_url){

      // Show image immediately
      photoPreview.src = data.secure_url;

      if(currentUser){
        await setDoc(doc(db,"users",currentUser.uid),{
          photoURL:data.secure_url
        },{merge:true});
      }

      alert("Photo Updated!");

    } else {
      alert("Upload failed");
      console.log(data);
    }

  } catch(error){
    console.error("Upload error:", error);
    alert("Upload error");
  }

});
