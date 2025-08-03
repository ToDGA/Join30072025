window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const loginPage = document.getElementById("loginPage");

  if (!intro || !loginPage) return;

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
});
