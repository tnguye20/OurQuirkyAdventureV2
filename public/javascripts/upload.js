/**
 * COMMON VARIABLES
 */

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
