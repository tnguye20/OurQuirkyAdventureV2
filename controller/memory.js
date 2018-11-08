const functions = require("./functions");
const Memory = require("../models/memory");

module.exports.memory = async (req, res, next) => {
  const results = await functions.getMemoryWithLinks(req.session.token);
  if(results.length > 0){
    res.render("memory", {data: results});
  }else{
   res.redirect("/upload");
  }
}
