window.addEventListener("DOMContentLoaded", () => {
  // === Intro screen logic ===
  const intro = document.getElementById("intro");
  const loginPage = document.getElementById("loginPage");

  if (intro && loginPage) {
    setTimeout(() => {
      loginPage.style.opacity = "1";
    }, 2600);

    setTimeout(() => {
      intro.classList.add("white-bg");
    }, 2700);

    setTimeout(() => {
      intro.style.opacity = "0";
    }, 3100);

    setTimeout(() => {
      intro.style.display = "none";
    }, 3500);
  }
  // === Password field logic ===
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("toggle-password");
  const lockPassword = document.getElementById("lock-password");
  // Toggle password visibility
  togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.src = isHidden
      ? "./assets/img/visibility.svg"
      : "./assets/img/visibility_off.svg";
  });
  // Show/hide icons based on input
  passwordInput.addEventListener("input", () => {
    const hasValue = passwordInput.value.length > 0;
    togglePassword.style.display = hasValue ? "block" : "none";
    lockPassword.style.display = hasValue ? "none" : "block";
  });
  // === Form validation ===
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let hasError = false;
    // Email validation
    if (!emailInput.value.includes("@")) {
      emailInput.classList.add("error");
      emailError.style.display = "block";
      hasError = true;
    } else {
      emailInput.classList.remove("error");
      emailError.style.display = "none";
    }
    // Password validation
    if (passwordInput.value.length < 6) {
      passwordInput.classList.add("error");
      passwordError.style.display = "block";
      hasError = true;
    } else {
      passwordInput.classList.remove("error");
      passwordError.style.display = "none";
    }
    if (!hasError) {
      console.log("Log in successful!");
      // TODO: Replace this with actual login logic
    }
  });
});