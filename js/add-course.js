import { auth, db } from "./firebase.js";

import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from 
"https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";


const form = document.getElementById("courseForm");

form.addEventListener("submit", async (e)=>{
  e.preventDefault();

  if(!auth.currentUser){
    alert("Login required");
    return;
  }

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const price = document.getElementById("price").value;
  const thumbnailFile = document.getElementById("thumbnail").files[0];
  const videoFile = document.getElementById("video").files[0];

  if(!title || !description || !thumbnailFile || !videoFile){
    alert("Fill all fields");
    return;
  }

  try{

    const thumbURL = await uploadFile(thumbnailFile, "image");
    const videoURL = await uploadFile(videoFile, "video");

    await addDoc(collection(db,"courses"),{
      title,
      description,
      thumbnail: thumbURL,
      video: videoURL,
      type: price ? "paid" : "free",
      price: price ? Number(price) : 0,
      previewTime: 30,
      visibility: "public",   // ✅ VERY IMPORTANT
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp()
    });

    alert("Course Uploaded Successfully ✅");
    form.reset();

  }catch(error){
    console.error(error);
    alert("Upload Failed");
  }

});


/* ===============================
   CLOUDINARY UPLOAD
================================ */
const CLOUD_NAME = "dlqbfsh92";
const UPLOAD_PRESET = "v8kfswiw";

function uploadFile(file, type){

  return new Promise((resolve,reject)=>{

    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`
    );

    xhr.onload = function(){
      const data = JSON.parse(xhr.responseText);

      if(xhr.status === 200){
        resolve(data.secure_url);
      }else{
        reject(data);
      }
    };

    xhr.send(formData);

  });
}
