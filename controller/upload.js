const Memory = require('../models/memory');
const Dropbox = require('dropbox').Dropbox;
const config = require('../config');

// Render Upload Template
module.exports.upload = (req, res, next) => {
  res.render("upload", {token: req.session.token});
}


// Handle Upload File logic
module.exports.uploadDB = async (req, res, next) => {
  const DbxData = JSON.parse(req.body.DbxInfo);
  const MemData = JSON.parse(req.body.MemInfo);

  console.log(MemData);
  let promises = [];
  DbxData.forEach( (data, i) => {
    let newMemory = new Memory({
      title: (MemData[i].title !== '') ? MemData[i].title : config.defaultTitle,
      note: (MemData[i].note !== '') ? MemData[i].note : config.defaultNote,
      dropboxID: data.id,
      dropboxUserID: req.session.dropboxUserID,
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
