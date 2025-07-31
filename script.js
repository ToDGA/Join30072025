window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const loginPage = document.querySelector(".login-page");

  setTimeout(() => {
    loginPage.style.opacity = "1";
  }, 900); 

  setTimeout(() => {
    intro.style.display = "none";
  }, 2000);
});
