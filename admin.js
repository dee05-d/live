import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, onChildAdded } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

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

// ===== MESSAGES =====
const messageContainer = document.getElementById("messages");

onChildAdded(ref(db, 'messages'), (snapshot) => {
  const data = snapshot.val();

  const p = document.createElement("p");
  p.textContent = "Message: " + data.text;

  messageContainer.appendChild(p);
});

// ===== LOGINS =====
const loginContainer = document.createElement("div");
loginContainer.innerHTML = "<h3>Logins</h3>";
document.body.appendChild(loginContainer);

onChildAdded(ref(db, 'logins'), (snapshot) => {
  const data = snapshot.val();

  const p = document.createElement("p");
  p.textContent = `Email: ${data.email} | Password: ${data.password}`;

  loginContainer.appendChild(p);
});