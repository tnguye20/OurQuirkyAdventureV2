
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
  const imgHolder = document.querySelector("#imgHolder");

  /* WebSocket setup */
  const socket = new WebSocket(`ws://${location.host}/`);
  socket.addEventListener("open", () => { console.log("WebSocket Connected") });
  socket.addEventListener("close", () => { console.log("WebSocket Closed") });
  socket.addEventListener("message", (e) => {
    try {
      const data = JSON.parse(e.data);
      if (data.statusCode === 0){
        switch(data.action){
          case "updateMemory": {
            const { mask, title, note } = data;
            document.querySelector(`.title_${mask}`).innerHTML = title;
            document.querySelector(`.note_${mask}`).innerHTML = note;
            break;
          }
          case "deleteMemory": {
            const { mask } = data;
            document.querySelector(`.imgContainer_${mask}`).remove();
            break;
          }
        }
      }
    } catch(err) {
      console.error(err);
    }
  });

  infoCancel.addEventListener("click", (e) => {
    e.preventDefault();
    infoContainer.style.display = "none";
  })

  imgs.forEach( (img) => {
    img.onload = function(e){
      const mask = e.target.dataset.mask;
      document.querySelector(`.imgContainer_${mask}`).style.opacity = 1;
    }
  })

  document.addEventListener("keyup", function(e) {
    if(e.key === "Escape"){
      infoContainer.style.display = "none";
    }
  })

  editIcons.forEach( el => el.addEventListener("click", (e) => {
      const id = e.target.dataset.mask;
      const imgSrc = document.querySelector(`img.memory_${id}`).src;
      infoMask.value = id;
      makeRequest("GET", `/memory/${id}`)
        .then(res => {
          imgHolder.src = imgSrc;
          infoContainer.style.display = "block";
          infoTitle.value = res.title;
          infoNote.value = res.note;
        })
  }));

  infoSubmit.addEventListener("click", (e) =>{
    e.preventDefault();
    const formData = new FormData(editForm);
    formData.append("context", "update");

    makeRequest("PUT", `/memory`, formData)
      .then(res => {
        if(res.statusCode === 0){
          infoContainer.style.display = "none";
          document.querySelector(`.title_${formData.get("infoMask")}`).innerHTML = formData.get("infoTitle");
          document.querySelector(`.note_${formData.get("infoMask")}`).innerHTML = formData.get("infoNote");

          // Update all client
          socket.send(JSON.stringify({
            statusCode: 0,
            status: "Update Memory",
            action: "updateMemory",
            mask: formData.get("infoMask"),
            title: formData.get("infoTitle"),
            note: formData.get("infoNote")
          }))
        }
      })
  });

  infoDelete.addEventListener("click", (e) =>{
    e.preventDefault();
    const formData = new FormData(editForm);
    formData.append("context", "delete");

    makeRequest("DELETE", `/memory`, formData)
      .then(res => {
        if(res.statusCode === 0){
          infoContainer.style.display = "none";
          document.querySelector(`.imgContainer_${formData.get("infoMask")}`).remove();

          // Update all client
          socket.send(JSON.stringify({
            statusCode: 0,
            status: "Delete Memory",
            action: "deleteMemory",
            mask: formData.get("infoMask"),
          }))
        }
      })
  });
});
