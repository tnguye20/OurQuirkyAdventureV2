const Memory = require('../models/memory');
const functions = require('./functions');

module.exports.gallery = async (req, res, next) => {
  // Acquire info from Mongo to query Dropbox
  const results = await functions.getMemoryWithLinks(req.session.token, req.session.dropboxUserID);
  res.render("gallery", {data: results, layout: false});
}
