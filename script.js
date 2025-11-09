/* Cache DOM elements for reuse */
const els = {
  intro: document.getElementById("intro"),
  loginPage: document.getElementById("loginPage"),
  introLogo: document.getElementById("introLogo"),
  password: document.getElementById("password"),
  toggle: document.getElementById("toggle-password"),
  lock: document.getElementById("lock-password"),
  form: document.getElementById("login-form"),
  email: document.getElementById("email"),
  emailError: document.getElementById("email-error"),
  passwordError: document.getElementById("password-error")
};

/* Set initial logo and background for intro */
function setIntro() {
  if (!els.intro || !els.loginPage || !els.introLogo) return;
  const isMobile = window.innerWidth <= 480;
  els.introLogo.src = isMobile ? "./assets/img/Capa 2white.svg" : "./assets/img/Capa 2.svg";
  els.intro.style.backgroundColor = isMobile ? "#2A3647" : "transparent";
}

/* Show login page after 1-second delay */
function showLogin() {
  if (!els.intro || !els.loginPage || !els.introLogo) return;
  setTimeout(() => {
    els.introLogo.src = "./assets/img/Capa 2.svg";
    els.intro.style.backgroundColor = "transparent";
    els.intro.style.pointerEvents = "none";
    els.loginPage.style.opacity = "1";
  }, 1000);
}

/* Toggle password field between text and password */
function togglePasswordVisibility() {
  if (!els.password || !els.toggle) return;
  els.toggle.addEventListener("click", () => {
    const isHidden = els.password.type === "password";
    els.password.type = isHidden ? "text" : "password";
    els.toggle.src = isHidden ? "./assets/img/visibility.svg" : "./assets/img/visibility_off.svg";
  });
}

/* Show/hide password icons based on input */
function updatePasswordIcons() {
  if (!els.password || !els.toggle || !els.lock) return;
  els.password.addEventListener("input", () => {
    const hasValue = els.password.value.length > 0;
    els.toggle.style.display = hasValue ? "block" : "none";
    els.lock.style.display = hasValue ? "none" : "block";
  });
}

/* Validate form on submit and show errors */
function validateForm() {
  if (!els.form) return;
  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailValid = els.email.value.includes("@");
    const passValid = els.password.value.length >= 6;
    els.email.classList.toggle("error", !emailValid);
    els.emailError.style.display = emailValid ? "none" : "block";
    els.password.classList.toggle("error", !passValid);
    els.passwordError.style.display = passValid ? "none" : "block";
    if (emailValid && passValid) console.log("Log in successful!");
  });
}

/* Initialize all page functionality */
function init() {
  setIntro(); // Start intro with logo and background
  showLogin(); // Transition to login page
  togglePasswordVisibility(); // Enable password toggle
  updatePasswordIcons(); // Manage password icon visibility
  validateForm(); // Set up form validation
}

init(); // Run all initialization