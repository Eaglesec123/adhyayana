import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, getDoc } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", () => {

  const navLinks = document.querySelectorAll(".nav-link");
  const pages = document.querySelectorAll(".content.page");

  // 🔹 PAGE SWITCH LOGIC
  navLinks.forEach(link => {
    link.addEventListener("click", () => {

      const targetPage = link.dataset.page;

      // reset
      navLinks.forEach(l => l.classList.remove("active"));
      pages.forEach(p => p.classList.remove("active"));

      // activate
      link.classList.add("active");

      const page = document.getElementById(`page-${targetPage}`);
      if (page) {
        page.classList.add("active");
      } else {
        console.error("❌ Page not found:", `page-${targetPage}`);
      }
    });
  });

  // 🔹 LOAD PROFILE DATA
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    document.getElementById("pEmail").innerText = user.email;

    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      const d = snap.data();
      document.getElementById("pRole").innerText = d.role || "-";
      document.getElementById("pCategory").innerText = d.category || "-";
      document.getElementById("pSkills").innerText =
        (d.skills || []).join(", ") || "-";
      document.getElementById("pAddress").innerText = d.address || "-";
    }
  });

});
