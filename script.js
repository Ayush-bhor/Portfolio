// ==========================================
// script.js - portfolio functionality
// wrote most of this while following random tutorials + MDN docs
// ==========================================

// -------- set current year in footer --------
document.getElementById("year").textContent = new Date().getFullYear();


// -------- MOBILE NAV TOGGLE --------
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", function () {
  navLinks.classList.toggle("show-menu");
});

// close mobile menu when a link is clicked (learned this the hard way after testing on my phone)
const allNavLinks = document.querySelectorAll(".nav-link");
for (let i = 0; i < allNavLinks.length; i++) {
  allNavLinks[i].addEventListener("click", function () {
    navLinks.classList.remove("show-menu");
  });
}


// -------- SMOOTH SCROLLING --------
// grabbing all links that start with # and scrolling smoothly to them
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    const targetEl = document.querySelector(targetId);

    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});


// -------- ACTIVE NAVBAR HIGHLIGHTING --------
// checks which section is currently in view and highlights the matching nav link
const sections = document.querySelectorAll("section[id]");

function highlightNav() {
  let currentSection = "";
  const scrollY = window.pageYOffset;

  sections.forEach(function (section) {
    const sectionTop = section.offsetTop - 100; // small offset for navbar height
    const sectionHeight = section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id");
    }
  });

  allNavLinks.forEach(function (link) {
    link.classList.remove("active-link");
    if (link.getAttribute("href") === "#" + currentSection) {
      link.classList.add("active-link");
    }
  });
}

window.addEventListener("scroll", highlightNav);


// -------- DARK MODE TOGGLE --------
const darkModeBtn = document.getElementById("darkModeBtn");

// check localStorage on page load, keep user's preference
if (localStorage.getItem("darkMode") === "on") {
  document.body.classList.add("dark-mode");
  darkModeBtn.textContent = "☀️";
}

darkModeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "on");
    darkModeBtn.textContent = "☀️";
  } else {
    localStorage.setItem("darkMode", "off");
    darkModeBtn.textContent = "🌙";
  }
});


// -------- TYPING ANIMATION (simple version, no library) --------
const typingWords = ["Frontend Developer", "Web Design Learner", "JavaScript Enthusiast"];
const typingEl = document.getElementById("typingText");

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentWord = typingWords[wordIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typingEl.textContent = currentWord.substring(0, charIndex);

  let typeSpeed = isDeleting ? 60 : 110;

  // finished typing the word, pause then start deleting
  if (!isDeleting && charIndex === currentWord.length) {
    typeSpeed = 1400;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % typingWords.length;
    typeSpeed = 400;
  }

  setTimeout(typeEffect, typeSpeed);
}

// kick it off
typeEffect();


// -------- SCROLL REVEAL USING INTERSECTION OBSERVER --------
// add "reveal" class to elements we want to fade in, JS handles the rest

// grabbing a bunch of elements to animate in - not every single element, just the main ones
const revealTargets = document.querySelectorAll(
  ".section-title, .about-text, .skill-item, .edu-card, .contact-card, .contact-link-item, .contact-form"
);

revealTargets.forEach(function (el) {
  el.classList.add("reveal");
});

const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        // stop observing once it's shown, no need to keep checking
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealTargets.forEach(function (el) {
  observer.observe(el);
});


// -------- CONTACT FORM VALIDATION --------
// just basic frontend checks, no backend connected yet (maybe later)

const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const formSuccess = document.getElementById("formSuccess");

function showError(inputEl, errorId, msg) {
  document.getElementById(errorId).textContent = msg;
  inputEl.parentElement.classList.add("invalid");
}

function clearError(inputEl, errorId) {
  document.getElementById(errorId).textContent = "";
  inputEl.parentElement.classList.remove("invalid");
}

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let isValid = true;

  // name check
  if (nameInput.value.trim() === "") {
    showError(nameInput, "nameError", "Please enter your name");
    isValid = false;
  } else {
    clearError(nameInput, "nameError");
  }

  // email check - simple regex, not super strict but good enough
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailInput.value.trim() === "") {
    showError(emailInput, "emailError", "Please enter your email");
    isValid = false;
  } else if (!emailPattern.test(emailInput.value.trim())) {
    showError(emailInput, "emailError", "That email doesn't look right");
    isValid = false;
  } else {
    clearError(emailInput, "emailError");
  }

  // message check
  if (messageInput.value.trim() === "") {
    showError(messageInput, "messageError", "Don't leave this empty!");
    isValid = false;
  } else if (messageInput.value.trim().length < 10) {
    showError(messageInput, "messageError", "Message is a bit too short");
    isValid = false;
  } else {
    clearError(messageInput, "messageError");
  }

  if (isValid) {
    formSuccess.classList.add("show");
    contactForm.reset();

    // hide the success message after a few seconds
    setTimeout(function () {
      formSuccess.classList.remove("show");
    }, 5000);
  } else {
    formSuccess.classList.remove("show");
  }
});

// TODO: connect this form to an actual backend / email service (EmailJS maybe?)
// TODO: add a loading spinner on submit once real backend is added
