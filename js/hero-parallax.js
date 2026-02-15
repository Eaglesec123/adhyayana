const heroBg = document.querySelector(".hero-bg");

if (heroBg) {
  // Scroll parallax
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
  });

  // Mouse parallax (desktop only)
  if (window.innerWidth > 768) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;

      heroBg.style.transform = `
        translate(${x}px, ${y}px)
      `;
    });
  }
}
