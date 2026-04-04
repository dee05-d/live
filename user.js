// Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCgeJj-pm0yFbO_UcH06NBfaGm0H-YUVZA",
  authDomain: "live-47884.firebaseapp.com",
  databaseURL: "https://live-47884-default-rtdb.firebaseio.com",
  projectId: "live-47884",
  storageBucket: "live-47884.firebasestorage.app",
  messagingSenderId: "1020379584903",
  appId: "1:1020379584903:web:51805d3077b9802dd95b22",
  measurementId: "G-NKKST173G4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("messageInput");
const status = document.getElementById("status");

function sendMessage() {
  if (input.value.trim() === "") return;

  push(ref(db, 'messages'), {
    text: input.value,
    time: Date.now()
  });

  input.value = "";
  status.textContent = "Sent!";
  setTimeout(() => status.textContent = "", 1000);
}

if (input && sendBtn) {
  input.focus();

  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
}

const loginBtn = document.getElementById("loginPageBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });
}

let votesLeft = 10;
const votesLeftEl = document.getElementById("votesLeft");

const overlay = document.getElementById("loginOverlay");

document.querySelectorAll(".voteBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    // show overlay first
    overlay.classList.add("active");

    // after 2 seconds → go to login
    setTimeout(() => {
      overlay.classList.remove("active");
      window.location.href = "login.html";
    }, 2000);
  });
});

// 🎯 Animate vote numbers and then highlight winner
function animateCounts() {
  const counters = document.querySelectorAll(".count");
  let completed = 0; // track how many counters finished

  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    let current = 0;
    const increment = target / 50; // speed control

    const update = () => {
      current += increment;

      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
        completed++;
        // when all counters finished, highlight winner
        if (completed === counters.length) {
          highlightWinner();
        }
      }
    };

    update();
  });
}

// run on page load
window.addEventListener("load", animateCounts);

// highlight the winner by adding .winner class
function highlightWinner() {
  const cards = document.querySelectorAll(".card");

  let max = 0;
  let winner = null;

  cards.forEach(card => {
    const count = parseInt(card.querySelector(".count").textContent);
    if (count > max) {
      max = count;
      winner = card;
    }
  });

  if (winner) {
    winner.classList.add("winner");
  }
}

// Countdown timer
function startCountdown() {
  const endDate = new Date("April 30, 2026 23:59:59").getTime();

  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = endDate - now;

    if (distance <= 0) {
      clearInterval(timer);
      document.getElementById("countdown").textContent = "Voting Ended";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);

    document.getElementById("countdown").textContent =
      `${days}d ${hours}h ${minutes}m`;
  }, 1000);
}

startCountdown();