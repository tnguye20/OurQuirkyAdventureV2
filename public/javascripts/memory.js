
document.addEventListener("DOMContentLoaded", function() {
  const imgs = document.querySelectorAll(".imgContainer img");
  imgs.forEach( (img) => {
    img.onload = function(e){
      e.target.closest(".imgContainer").style.opacity = 1;
    }

    img.addEventListener("dblclick", (e) => {
      e.preventDefault();
      const id = e.target.dataset.mask;
      console.log(id);
      window.location.replace(`/memory/${ id  }`);
    })
  })
});
