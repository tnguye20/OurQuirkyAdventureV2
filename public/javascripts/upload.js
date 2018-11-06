var infoContainerObj = {};
var infoContainer, infoTitle, infoNote, infoSeq;

document.addEventListener("DOMContentLoaded", function() {

  infoContainer = document.querySelector("#infoContainer");
  infoTitle = document.querySelector("#infoTitle");
  infoNote = document.querySelector("#infoNote");
  infoSeq = document.querySelector("#infoSeq");

  // Detect Onload File to setup Preview
  const uploader = document.querySelector("#memoryUpload");
  uploader.addEventListener("change", function(e){
    let files = Object.values(e.target.files);

    // Check for file type -- accept images for now
    if(files.length > 0 && files.length){
      for(let file of files){
        if(!/\.(jpe?g|png|gif)$/i.test(file.name) || !/image/i.test(file.type)){
          console.log("File Type Not Supported");
          e.target.value = "";
          return false;
        }
      };
    }

    // Proceed to preview the images
    previewImages(files);
  });

  const uploadForm = document.querySelector("#uploadForm");
  uploadForm.addEventListener("submit", async function(e){
    e.preventDefault();

    if(uploader.files.length === 0){
      console.log("No file to upload");
      return false;
    }

    console.log(uploader.files.length);
    const token = document.querySelector("#tokenHolder").value;
    const dbx = new Dropbox.Dropbox({ accessToken: token, fetch: fetch});
    let files = Object.values(uploader.files);
    let uploaded = [];

    // Upload Files to Dropbox and reveal preloader
    document.querySelector(".progress").style.display = "block";
    let promises = [];
    uploader.disabled = true;
    files.forEach( (file) => {
      promises.push(dbx.filesUpload({path: '/' + file.name, contents: file}));
    } );

    uploaded = await Promise.all(promises);

    // Send Data to End Point
    $.ajax({
      url: "/upload",
      type: "POST",
      data: {
              DbxInfo : JSON.stringify(uploaded),
              MemInfo : JSON.stringify(infoContainerObj)
            },
      success: function(response) {
        console.log(response)
        window.location.replace("/memory");
      }
    });

  });

  document.addEventListener("keyup", function(e) {
    if(e.key === "Escape"){
      infoContainer.style.display = "none";
    }
  })

  const infoSubmit = document.querySelector("#infoSubmit");
  infoSubmit.addEventListener("click", function(e) {
    e.preventDefault();
    let i = infoSeq.value;
    infoContainerObj[i].title = infoTitle.value;
    infoContainerObj[i].note = infoNote.value;
    modalToggle();
  })
});



function modalToggle(i){
  infoContainer.style.display = (infoContainer.style.display === "none" || infoContainer.style.display === "") ? "block" : "none";

  if(i === undefined) return;

  // Populate Data according to Obj
  infoTitle.value = infoContainerObj[i].title;
  infoNote.value = infoContainerObj[i].note;
  infoSeq.value = i;
}

function imageInfo(i){
  modalToggle(i);
}

function emptyContainer(el){
  el.innerHTML = '';
}

function previewImages(files){
  const previewContainer = document.querySelector("#previewContainer");
  emptyContainer(previewContainer);

  for(let i = 0; i < files.length; i ++){
    // Instantiate FileReader Object
    const reader = new FileReader();

    // Construct File Objects to Blob File for preview
    reader.onload = function(){
      let src = reader.result;
      if(src !== null){
        previewContainer.appendChild(createImageElement(src, i));
        infoContainerObj[i] = {
          title: "",
          note: ""
        };
      }else{
        console.log("Bad URL");
        return false;
      }
    }
    reader.readAsDataURL(files[i]);
  }
}


function createImageElement(src, i){
  // Image Container Element
  let div = document.createElement("div");
  div.classList.add("col","s4", "info_" + i);

  // Image Element
  let img = document.createElement("img");
  img.classList.add("responsive-img");
  img.src = src;

  div.appendChild(img);
  div.addEventListener("click", () => { imageInfo(i) });

  return div;
}
