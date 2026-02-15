const welcomeBox = document.getElementById("welcomeBox");

if (sessionStorage.getItem("welcomeUser") === "true") {
  welcomeBox.style.display = "block";

  // Remove flag so it shows only once
  sessionStorage.removeItem("welcomeUser");

  // Auto hide after 4 seconds
  setTimeout(() => {
    welcomeBox.style.display = "none";
  }, 4000);
}
