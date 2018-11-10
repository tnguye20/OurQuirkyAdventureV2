document.addEventListener("DOMContentLoaded", (e) => {
  const img = document.querySelector(".imgContainer img");
  img.addEventListener("load", (e) => {
    e.target.closest(".imgContainer").style.opacity = 1;
  })
});
