// Sparkle effect on mouse move
// function createSparkle(e) {
// const sparkle = document.createElement("div");
// sparkle.className = "sparkle";
// document.body.appendChild(sparkle);
// sparkle.style.left = e.pageX - 5 + "px";
// sparkle.style.top = e.pageY - 5 + "px";
// sparkle.addEventListener("animationend", () => {
// sparkle.remove();
// });
// }
// document.addEventListener("mousemove", (e) => {
// if (Math.random() > 0.8) {
// createSparkle(e);
// }
// });

function createTrail(e) {
  const trail = document.createElement("div");
  trail.className = "trail";
  document.body.appendChild(trail);
  trail.style.left = e.pageX - 7.5 + "px";
  trail.style.top = e.pageY - 7.5 + "px";
  trail.addEventListener("animationend", () => {
    trail.remove();
  });
}
document.addEventListener("mousemove", (e) => {
  createTrail(e);
});

function updateClock() {
  // Create a date object with IST
  const options = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const dateOptions = {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const now = new Date();
  // Get time in IST
  const timeString = now.toLocaleTimeString("en-IN", options);
  const dateString = now.toLocaleDateString("en-IN", dateOptions);
  // Update the display
  document.getElementById("clock").textContent = timeString;
  document.getElementById("date").textContent = dateString;
}
// Update clock immediately and then every second
updateClock();
setInterval(updateClock, 1000);

document.addEventListener("DOMContentLoaded", () => {
  // Theme Switcher
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", savedTheme);
  themeToggle.checked = savedTheme === "dark";

  // Theme switch handler
  function toggleTheme() {
    const newTheme = themeToggle.checked ? "dark" : "light";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }

  themeToggle.addEventListener("change", toggleTheme);
  // Remove preloader
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    preloader.style.opacity = "0";
    setTimeout(() => preloader.remove(), 500);
  });

  // Mobile menu toggle
  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelectorAll(".nav__link");

  function toggleMenu() {
    navMenu.classList.toggle("show");
  }

  navToggle.addEventListener("click", toggleMenu);

  // Close mobile menu when clicking links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("show");
    });
  });

  // Active link highlighting
  function highlightActiveSection() {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute("id");
      const correspondingLink = document.querySelector(
        `.nav__link[href*="${sectionId}"]`
      );

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        correspondingLink.classList.add("active");
      } else {
        correspondingLink.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", highlightActiveSection);

  // Reveal animations
  const revealElements = document.querySelectorAll(".reveal");
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px",
  };

  const revealCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  };

  const revealObserver = new IntersectionObserver(
    revealCallback,
    revealOptions
  );
  revealElements.forEach((element) => revealObserver.observe(element));

  // Form handling
  const contactForm = document.getElementById("contact-form");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const formProps = Object.fromEntries(formData);

    // Basic form validation
    for (let value of Object.values(formProps)) {
      if (!value.trim()) {
        alert("Please fill in all fields");
        return;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formProps.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Here you would typically send the form data to a server
    // For now, we'll just show a success message
    alert("Message sent successfully!");
    contactForm.reset();
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

//contact form:
const scriptURL =
  "https://script.google.com/macros/s/AKfycbzrJb34-CsgSPcOFhWrUK2_lqSoQXqekzkIJqlEi9EZwFekjxFCxkzaM8O1rKwC3WZLjw/exec";
const form = document.forms["google-sheet"];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) =>
      alert("Thanks for Contacting me..! I Will Contact You Soon...")
    )
    .catch((error) => console.error("Error!", error.message));
});
