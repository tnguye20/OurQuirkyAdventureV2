const functions = require("./functions");
const Memory = require("../models/memory");
const connfig = require("../config");

/*
 * TODO: Implement Sanetization
 * TODO: Edit Image should use POST to abstract ID
*/

module.exports.memory = async (req, res, next) => {
  const results = await functions.getMemoryWithLinks(req.session.token);
  if(results.length > 0){
    res.render("memory", {data: results});
  }else{
   res.redirect("/upload");
  }
}

module.exports.loadMemoryById = async(req, res, next) => {
  const result = await functions.getMemoryById(req.session.token, req.params.mem_id);
  res.render("memoryEdit", {data: result});
}

module.exports.postMemoryById = async (req, res, next) => {
  console.log(req.body);
  console.log(req.params.mem_id);
  if(req.body.infoSubmit.toLowerCase() === "update"){
    const result = await Memory.update(
      { _id: req.params.mem_id },
      { $set: {
        title: req.body.infoTitle,
        note: req.body.infoNote
      } }
    );
  } else if(req.body.infoSubmit.toLowerCase() === "delete"){
    const result = await Memory.deleteOne({ _id: req.params.mem_id  });
  }
  res.redirect("/memory");
}
