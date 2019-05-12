
document.addEventListener("DOMContentLoaded", function() {
  const imgs = document.querySelectorAll(".imgContainer img");
  const editIcons = document.querySelectorAll(".editIcon");
  const infoContainer = document.querySelector("#infoContainer");
  const infoTitle = document.querySelector("#infoTitle");
  const infoNote = document.querySelector("#infoNote");
  const infoMask = document.querySelector("#infoMask");
  const infoCancel = document.querySelector("#infoCancel");
  const editForm = document.querySelector("form#editForm");
  const infoSubmit = document.querySelector("#infoSubmit");
  const infoDelete = document.querySelector("#infoDelete");

  infoCancel.addEventListener("click", (e) => {
    e.preventDefault();
    infoContainer.style.display = "none";
  })

  imgs.forEach( (img) => {
    img.onload = function(e){
      e.target.closest(".imgContainer").style.opacity = 1;
    }
  })

  editIcons.forEach( el => el.addEventListener("click", (e) => {
      const id = e.target.dataset.mask;
      infoMask.value = id;
      console.log(id);
      makeRequest("GET", `/memory/${id}`)
        .then(res => {
          console.log(res);
          infoContainer.style.display = "block";
          infoTitle.value = res.title;
          infoNote.value = res.note;
        })
  }));

  infoSubmit.addEventListener("click", (e) =>{
    e.preventDefault();
    const formData = new FormData(editForm);
    formData.append("context", "update");

    // for (var pair of formData.entries()) {
    //     console.log(pair[0]+ ', ' + pair[1]);
    // }

    makeRequest("PUT", `/memory`, formData)
      .then(res => {
        if(res.statusCode === 0){
          infoContainer.style.display = "none";
          document.querySelector(`.title_${formData.get("infoMask")}`).innerHTML = formData.get("infoTitle");
          document.querySelector(`.note_${formData.get("infoMask")}`).innerHTML = formData.get("infoNote");
        }
      })
  });

  infoDelete.addEventListener("click", (e) =>{
    e.preventDefault();
    const formData = new FormData(editForm);
    formData.append("context", "delete");

    // for (var pair of formData.entries()) {
    //     console.log(pair[0]+ ', ' + pair[1]);
    // }

    makeRequest("DELETE", `/memory`, formData)
      .then(res => {
        if(res.statusCode === 0){
          infoContainer.style.display = "none";
          document.querySelector(`.imgContainer_${formData.get("infoMask")}`).remove();
        }
      })
  });
});
