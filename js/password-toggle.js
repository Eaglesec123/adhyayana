document.querySelectorAll(".toggle-password").forEach(toggle => {
  toggle.addEventListener("click", () => {
    const input = toggle.previousElementSibling;
    const isPassword = input.type === "password";

    input.type = isPassword ? "text" : "password";
    toggle.textContent = isPassword ? "🙈" : "👁";
  });
});
