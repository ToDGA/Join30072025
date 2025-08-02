document.addEventListener("DOMContentLoaded", () => {
  const backArrow = document.querySelector(".back-arrow");
  if (backArrow) {
    backArrow.addEventListener("click", () => {
      window.location.href = "index.html"; 
    });
  }
});