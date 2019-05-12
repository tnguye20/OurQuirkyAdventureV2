const Memory = require('../models/memory');
const fetch = require('node-fetch');
const Dropbox = require('dropbox').Dropbox;
const jo = require('jpeg-autorotate');
const config = require('../config');
const ExifImage = require('exif').ExifImage;

// Render Upload Template
module.exports.upload = (req, res, next) => {
  res.render("upload", {token: req.session.token});
}


// Handle Upload File logic
module.exports.uploadDB = async (req, res, next) => {
  const MemData = JSON.parse(req.body.memInfo);
  console.log(MemData);

  // req.files.forEach( file => {
  //   new ExifImage({image: file.buffer}, function(error, exifData){
  //     console.log(exifData);
  //   })
  // });

  // Rotate the Image
  options = { quality: 100 };
  let fileNames = []
  let promises = [];
  let rotatedFiles = [];
  req.files.forEach((file, index) => {
    fileNames.push(file.originalname);
    if(MemData[index].isRotate == true){
      promises.push(jo.rotate(file.buffer, options));
    } else {
      promises.push( new Promise(
        function(resolve, reject) {
          resolve(file)
        }
      ))
    }
  });

  rotatedFiles = await Promise.all(promises);
  console.log(fileNames);
  console.log(rotatedFiles);

  // Send Image to Dropbox and obtain ID
  dbx = new Dropbox({
    accessToken: req.session.token,
    fetch: fetch
  })

  promises = [];
  rotatedFiles.forEach((file, index) => {
    promises.push(dbx.filesUpload({path: `/${fileNames[index]}`, contents: file.buffer}));
  });
  const uploaded = await Promise.all(promises);
  console.log(uploaded);

  promises = [];
  uploaded.forEach( (data, index) => {
    let newMemory = new Memory({
      title: (MemData[index].title !== '') ? MemData[index].title : config.defaultTitle,
      note: (MemData[index].note !== '') ? MemData[index].note : config.defaultNote,
      dropboxID: data.id,
      dropboxUserID: req.session.dropboxUserID,
      name: data.name,
      size: data.size,
      path_lower: data.path_lower,
      sequence: index
    });
    promises.push(newMemory.save());
  })
  const response = await Promise.all(promises);

  res.json({
    statusCode: 0,
    status: "Upload Successful"
  });
}
