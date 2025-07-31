const toggleBtn = document.getElementById("dark-mode-toggle");

// Toggle theme on click
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");

  // Save preference
  localStorage.setItem("theme", isDark ? "dark" : "light");

  // Toggle icon
  toggleBtn.textContent = isDark ? "☀️" : "🌙";
});

// Load stored theme on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️";
  } else {
    toggleBtn.textContent = "🌙";
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('show');
  });
});
document.querySelectorAll('.feature-card, .learn-box, .fact-card, .breed-card1, .breed-card2, .breed-card3, .btn1, .btn2, .cta-btn')
  .forEach(el => {
    el.addEventListener('hover', () => {
      el.classList.add('tapped');
      setTimeout(() => el.classList.remove('tapped'), 300); // tap feedback lasts 300ms
    });
  });
