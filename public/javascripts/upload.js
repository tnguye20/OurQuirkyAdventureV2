var infoContainerObj = {};
var infoContainer, infoTitle, infoNote, infoSeq;

var rotation = {
  1: 'rotate(0deg)',
  3: 'rotate(180deg)',
  6: 'rotate(90deg)',
  8: 'rotate(270deg)'
};

document.addEventListener("DOMContentLoaded", function() {

  infoContainer = document.querySelector("#infoContainer");
  infoTitle = document.querySelector("#infoTitle");
  infoNote = document.querySelector("#infoNote");
  infoSeq = document.querySelector("#infoSeq");
  const uploadForm = document.querySelector("#uploadForm");
  const uploader = document.querySelector("#memoryUpload");
  const previewContainer = document.querySelector("#previewContainer");

  // Detect Onload File to setup Preview
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

    previewImages(files);
  });

  uploadForm.addEventListener("submit", async function(e){
    e.preventDefault();

    if(uploader.files.length === 0){
      console.log("No file to upload");
      return false;
    }

    const formData = new FormData(uploadForm);
    formData.append("memInfo", JSON.stringify(infoContainerObj));

    document.querySelector(".progress").style.display = "block";
    uploader.disabled = true;

    makeRequest("POST", "/upload", formData)
      .then( res => {
          if(res.statusCode === 0){
            window.location.replace("/memory");
          } else {
            console.log(res.status);
          }
      })
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

function _arrayBufferToBase64( buffer ) {
  var binary = ''
  var bytes = new Uint8Array( buffer )
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode( bytes[ i ] )
  }
  return window.btoa( binary );
}

function previewImages(files){
  emptyContainer(previewContainer);

  for(let i = 0; i < files.length; i ++){
    imgOrientation(files[i], (base64img, value) => {
      previewContainer.appendChild(createImageElement(base64img, i, value));
      infoContainerObj[i] = {
        title: "",
        note: "",
        isRotate: (value == 3 | value == 6 | value == 9) ? true : false
      };
    })
  }
}

function imgOrientation(file, callback){
    const fileReader = new FileReader()
    fileReader.onloadend = function(){
      let base64img = "data:"+file.type+";base64," + _arrayBufferToBase64(fileReader.result);
      let scanner = new DataView(fileReader.result);
      let idx = 0;
      let value = 1; // Non-rotated is the default
      if(fileReader.result.length < 2 || scanner.getUint16(idx) != 0xFFD8) {
        // Not a JPEG
        if(callback) {
          callback(base64img, value);
        }
        return;
      }
      idx += 2;
      let maxBytes = scanner.byteLength;
      while(idx < maxBytes - 2) {
        let uint16 = scanner.getUint16(idx);
        idx += 2;
        switch(uint16) {
          case 0xFFE1: // Start of EXIF
            let exifLength = scanner.getUint16(idx);
            maxBytes = exifLength - idx;
            idx += 2;
            break;
          case 0x0112: // Orientation tag
            // Read the value, its 6 bytes further out
            // See page 102 at the following URL
            // http://www.kodak.com/global/plugins/acrobat/en/service/digCam/exifStandard2.pdf
            value = scanner.getUint16(idx + 6, false);
            maxBytes = 0; // Stop scanning
            break;
        }
      }
      if(callback) {
        callback(base64img, value);
      }
    }
    fileReader.readAsArrayBuffer(file);
}

function createImageElement(src, i, value){
  // Image Container Element
  let div = document.createElement("div");
  div.style.marginBottom = "5px";
  let divContainerOuter= document.createElement("div");
  divContainerOuter.classList.add("rotation-wrapper-outer");
  let divContainerInner= document.createElement("div");
  divContainerInner.classList.add("rotation-wrapper-inner");
  div.classList.add("col","m4", "s12", "info_" + i);
  // div.style.transform = rotation[value];

  // Image Element
  let img = document.createElement("img");
  img.src = src;
  img.style.transform = rotation[value];
  img.style.display = "block";
  img.classList.add("responsive-img");

  // div.appendChild(img);
  div.appendChild(divContainerOuter);
  divContainerOuter.appendChild(divContainerInner);
  divContainerInner.appendChild(img)
  div.addEventListener("click", () => { imageInfo(i) });

  return div;
}
