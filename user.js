
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
  if(input.value.trim() === "") return;

  push(ref(db, 'messages'), {
    text: input.value,
    time: Date.now()
  });

  input.value = "";
  status.textContent = "Sent!";
  setTimeout(() => status.textContent = "", 1000);
}

input.focus();
sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

const loginBtn = document.getElementById("loginPageBtn");

loginBtn.addEventListener("click", () => {
  window.location.href = "login.html";
});