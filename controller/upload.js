const Memory = require('../models/memory');

// Render Upload Template
module.exports.upload = (req, res, next) => {
  res.render("upload");
}


// Handle Upload File logic
module.exports.uploadDB = (req, res, next) => {
  let a = new Memory({
    dropboxID: "rgkbjwenqkf",
    name: req.body.memoryUpload
  });
  a.save();
  // res.send(req.body);
}
