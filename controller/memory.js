const functions = require("./functions");
const Memory = require("../models/memory");

module.exports.memory = async (req, res, next) => {
 const results = await Memory.find({}).lean().exec();
  if(results.length > 0){
    for(let i = 0; i < results.length; i++){
      let link = await functions.getTemporaryLinkAsync(req.session.token, results[i].path_lower);
      results[i].link = link;
    }
    res.render("memory", {data: results});
  }else{
    res.redirect("/upload");
  }
}
