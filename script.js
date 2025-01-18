// Constants
const MAX_TRAILS = 50;
const GOOGLE_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbxkM4la2QZVhe3j-QitFxJsqDfxqZatwgjJbY9JCSU8VMrb-5sYLSeO3AefjQIcIbvgJQ/exec";

// DOM Elements
const form = document.querySelector("#contact-form");
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.querySelectorAll(".nav__link");
const revealElements = document.querySelectorAll(".reveal");

// Configuration Objects
const clockConfig = {
  timeOptions: {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  },
  dateOptions: {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  },
};

const revealOptions = {
  threshold: 0.15,
  rootMargin: "0px",
};

// Utility Functions
const sanitizeHTML = (str) => {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    console.warn("Could not save theme preference:", e);
  }
};

// Feature: Haptic Feedback
const triggerVibration = () => {
  if (!("ontouchstart" in window)) return;

  if (window.navigator.vibrate) {
    window.navigator.vibrate([50]);
  } else {
    console.warn("Vibration API not supported by your browser!");
  }
};

// Add vibration to all interactive elements
document.querySelectorAll("a, button, .nav__link, i").forEach((element) => {
  element.addEventListener("click", triggerVibration);
});

// Feature: Mouse Trail Effect
const createTrail = (e) => {
  const trails = document.querySelectorAll(".trail");
  if (trails.length > MAX_TRAILS) {
    trails[0].remove();
  }

  const trail = document.createElement("div");
  trail.className = "trail";
  document.body.appendChild(trail);
  trail.style.left = `${e.pageX - 7.5}px`;
  trail.style.top = `${e.pageY - 7.5}px`;

  trail.addEventListener("animationend", () => {
    trail.remove();
  });
};

// Feature: Clock and Date Display
const updateClock = () => {
  const clockElement = document.getElementById("clock");
  const dateElement = document.getElementById("date");

  if (!clockElement || !dateElement) return;

  const now = new Date();
  const timeString = now.toLocaleTimeString("en-IN", clockConfig.timeOptions);
  const dateString = now.toLocaleDateString("en-IN", clockConfig.dateOptions);

  clockElement.textContent = timeString;
  dateElement.textContent = dateString;
};

// Feature: Navigation
const toggleMenu = () => {
  navMenu.classList.toggle("show");
};

const highlightActiveSection = () => {
  const sections = document.querySelectorAll("section[id]");
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");
    const escapedId = CSS.escape(sectionId);
    const correspondingLink = document.querySelector(
      `.nav__link[href*="${escapedId}"]`
    );

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      correspondingLink.classList.add("active");
    } else {
      correspondingLink.classList.remove("active");
    }
  });
};

// Feature: Reveal Animations
const revealCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    }
  });
};

// Feature: Theme Switcher
const initializeTheme = () => {
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  const savedTheme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", savedTheme);
  themeToggle.checked = savedTheme === "dark";

  const toggleTheme = () => {
    const newTheme = themeToggle.checked ? "dark" : "light";
    html.setAttribute("data-theme", newTheme);
    saveTheme(newTheme);
  };

  themeToggle.addEventListener("change", toggleTheme);
};

// Feature: Smooth Scrolling
const initializeSmoothScrolling = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        if ("scrollBehavior" in document.documentElement.style) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else {
          window.scrollTo(0, target.offsetTop);
        }
      }
    });
  });
};

// Feature: Contact Form Handling
const handleContactForm = async (e) => {
  e.preventDefault();

  const submitButton = e.target.Submit;
  submitButton.innerHTML = "Submitting...";
  submitButton.disabled = true;

  const spinner = document.createElement("span");
  spinner.classList.add("spinner");
  submitButton.appendChild(spinner);

  try {
    const formData = new FormData(form);
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      body: formData,
    });

    const result = await response.text();
    document.getElementById("res").innerHTML = sanitizeHTML(result);

    form.reset();
    setTimeout(() => {
      document.getElementById("res").innerHTML = "";
    }, 2000);
  } catch (error) {
    document.getElementById("res").innerHTML =
      "An error occurred. Please try again.";
  } finally {
    submitButton.innerHTML = "Send Message";
    submitButton.disabled = false;
  }
};

// Styles
const addSpinnerStyles = () => {
  const style = document.createElement("style");
  style.innerHTML = `
    .spinner {
      border: 2px solid rgba(255, 255, 255, 0.3); 
      border-top: 2px solid #fff; 
      border-radius: 50%;
      width: 14px;
      height: 14px;
      animation: spin 1s linear infinite;
      margin-left: 8px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
};

// Event Listeners and Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Initialize features
  initializeTheme();
  initializeSmoothScrolling();
  addSpinnerStyles();

  // Setup clock
  updateClock();
  setInterval(updateClock, 1000);

  // Setup navigation
  if (navMenu && navToggle) {
    navToggle.addEventListener("click", toggleMenu);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("show");
    });
  });

  // Setup animations
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      revealCallback,
      revealOptions
    );
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("active"));
  }

  // Setup form
  form.addEventListener("submit", handleContactForm);

  // Setup mouse trail
  document.addEventListener("mousemove", createTrail);

  // Setup scroll handling
  window.addEventListener("scroll", highlightActiveSection);

  // Remove preloader
  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.classList.add("hidden");
    }
  });

  // Display main content
  const mainContent = document.querySelector("main");
  mainContent.style.display = "block";
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById("scroll-top");
window.addEventListener("scroll", () => {
  if (window.scrollY >= 560) {
    scrollTopBtn.classList.add("show-scroll");
  } else {
    scrollTopBtn.classList.remove("show-scroll");
  }
});
