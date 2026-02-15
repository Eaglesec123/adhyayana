import { auth } from "./firebase.js";

import { 
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


const main = document.querySelector(".main");


/* ===================================
   AUTH PROTECTION (PREVENT LOOP)
=================================== */
onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Sync Firebase user to localStorage
  localStorage.setItem("currentUser", JSON.stringify({
    uid: user.uid,
    name: user.displayName || "User",
    photo: user.photoURL || "images/user.png",
    email: user.email
  }));

});


/* ===================================
   LOGOUT
=================================== */
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e)=>{
    e.preventDefault();

    await signOut(auth);
    localStorage.removeItem("currentUser");

    window.location.href="login.html";
  });
}


/* ===================================
   DASHBOARD VIEW
=================================== */
const openDashboard = document.getElementById("openDashboard");

if(openDashboard){
  openDashboard.addEventListener("click",(e)=>{
    e.preventDefault();
    setActive(e.target);

    main.innerHTML = `
      <h2>Dashboard</h2>
      <div class="card">
        Welcome to your dashboard 👋
      </div>
    `;
  });
}


/* ===================================
   ADD COURSE
=================================== */
const openUpload = document.getElementById("openUpload");

if(openUpload){
  openUpload.addEventListener("click",(e)=>{
    e.preventDefault();
    setActive(e.target);

    main.innerHTML = `
      <h2>Add Course</h2>
      <div class="card">
        <p>This is the old simple upload section.</p>
        <input type="file" />
        <br><br>
        <button>Upload</button>
      </div>
    `;
  });
}


/* ===================================
   MY COURSES
=================================== */
const openCourses = document.getElementById("openCourses");

if(openCourses){
  openCourses.addEventListener("click",(e)=>{
    e.preventDefault();
    setActive(e.target);

    main.innerHTML = `
      <h2>My Courses</h2>
      <div class="card">
        <p>Your uploaded courses will show here.</p>
      </div>
    `;
  });
}


/* ===================================
   ACTIVE LINK
=================================== */
function setActive(el){
  document.querySelectorAll(".nav-link")
  .forEach(link=>link.classList.remove("active"));

  el.classList.add("active");
}
