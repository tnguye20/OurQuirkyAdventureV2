
document.addEventListener("DOMContentLoaded", function() {
  const imgs = document.querySelectorAll(".imgContainer img");
  imgs.forEach( (img) => {
    img.onload = function(e){
      e.target.closest(".imgContainer").style.opacity = 1;
    }
  })
});