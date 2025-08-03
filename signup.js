document.addEventListener("DOMContentLoaded", () => {
  const backArrow = document.querySelector(".back-arrow");
  if (backArrow) {
    backArrow.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
  const passwordInput = document.getElementById("signup-password");
  const confirmInput = document.getElementById("confirm-password");
  const togglePassIcon = document.getElementById("toggle-signup-password");
  const toggleConfirmIcon = document.getElementById("toggle-confirm-password");
  const lockPassIcon = document.getElementById("lock-signup-password");
  const lockConfirmIcon = document.getElementById("lock-confirm-password");

  function toggleVisibility(input, icon) {
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    icon.src = isHidden
      ? "./assets/img/visibility.svg"
      : "./assets/img/visibility_off.svg";
  }
  togglePassIcon.addEventListener("click", () => {
    toggleVisibility(passwordInput, togglePassIcon);
  });
  toggleConfirmIcon.addEventListener("click", () => {
    toggleVisibility(confirmInput, toggleConfirmIcon);
  });
  passwordInput.addEventListener("input", () => {
    const hasValue = passwordInput.value.length > 0;
    togglePassIcon.style.display = hasValue ? "block" : "none";
    lockPassIcon.style.display = hasValue ? "none" : "block";
  });
  confirmInput.addEventListener("input", () => {
    const hasValue = confirmInput.value.length > 0;
    toggleConfirmIcon.style.display = hasValue ? "block" : "none";
    lockConfirmIcon.style.display = hasValue ? "none" : "block";
  });

  // === Validation ===
  const form = document.getElementById("signup-form");
  const email = document.getElementById("signup-email");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let hasError = false;
    if (!email.value.includes("@")) {
      email.classList.add("error");
      emailError.style.display = "block";
      hasError = true;
    } else {
      email.classList.remove("error");
      emailError.style.display = "none";
    }
    if (passwordInput.value !== confirmInput.value) {
      passwordInput.classList.add("error");
      confirmInput.classList.add("error");
      passwordError.style.display = "block";
      hasError = true;
    } else {
      passwordInput.classList.remove("error");
      confirmInput.classList.remove("error");
      passwordError.style.display = "none";
    }
    if (!hasError) {
      console.log("Signup successful!");
    }
  });
});