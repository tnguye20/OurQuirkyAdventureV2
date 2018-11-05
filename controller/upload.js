const Memory = require('../models/memory');
const Dropbox = require('dropbox').Dropbox;

// Render Upload Template
module.exports.upload = (req, res, next) => {
  res.render("upload", {token: req.session.token});
}


// Handle Upload File logic
module.exports.uploadDB = async (req, res, next) => {
  const uploadedData = JSON.parse(req.body.data);
  let promises = [];
  uploadedData.forEach( (data, i) => {
    let newMemory = new Memory({
      dropboxID: data.id,
      name: data.name,
      size: data.size,
      path_lower: data.path_lower,
      sequence: i
    });
    promises.push(newMemory.save());
  } );
  const response = await Promise.all(promises);
  res.send(response);
}
