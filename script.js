window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const loginPage = document.getElementById("loginPage");
  const introLogo = document.getElementById("introLogo");

  if (intro && loginPage && introLogo) {
    if (window.innerWidth <= 480) {
      introLogo.src = "./assets/img/Capa 2white.svg";
      intro.style.backgroundColor = "#2A3647";
    } else {
      introLogo.src = "./assets/img/Capa 2.svg";
    }
    setTimeout(() => {
      if (window.innerWidth <= 480) {
        introLogo.src = "./assets/img/Capa 2.svg";
      }
      intro.style.backgroundColor = "transparent";
      intro.style.pointerEvents = "none";
      loginPage.style.opacity = "1";
    }, 1000);
  }

  // Password toggle
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("toggle-password");
  const lockPassword = document.getElementById("lock-password");

  togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.src = isHidden
      ? "./assets/img/visibility.svg"
      : "./assets/img/visibility_off.svg";
  });

  passwordInput.addEventListener("input", () => {
    const hasValue = passwordInput.value.length > 0;
    togglePassword.style.display = hasValue ? "block" : "none";
    lockPassword.style.display = hasValue ? "none" : "block";
  });

  // Form validation
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let hasError = false;

    if (!emailInput.value.includes("@")) {
      emailInput.classList.add("error");
      emailError.style.display = "block";
      hasError = true;
    } else {
      emailInput.classList.remove("error");
      emailError.style.display = "none";
    }

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
    }
  });
});