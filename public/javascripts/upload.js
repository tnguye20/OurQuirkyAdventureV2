
document.addEventListener("DOMContentLoaded", function() {

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
    uploader.disabled = true;
    for(let file of files){
      let response = await dbx.filesUpload({path: '/' + file.name, contents: file})
      console.log(response);
      uploaded.push(response);
    }

    // Send Data to End Point
    $.ajax({
      url: "/upload",
      type: "POST",
      data: {data : JSON.stringify(uploaded)},
      success: function(response) {
        console.log(response)
        window.location.replace("/memory");
      }
    });

  });
});

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
        previewContainer.appendChild(createImageElement(src));
      }else{
        console.log("Bad URL");
        return false;
      }
    }
    reader.readAsDataURL(files[i]);
  }
}


function createImageElement(src){
  // Image Container Element
  let div = document.createElement("div");
  div.classList.add("col","s4");

  // Image Element
  let img = document.createElement("img");
  img.classList.add("responsive-img");
  img.src = src;

  div.appendChild(img);

  return div;
}
