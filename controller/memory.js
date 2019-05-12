const functions = require("./functions");
const Memory = require("../models/memory");
const connfig = require("../config");
const Dropbox = require('dropbox').Dropbox;
const fetch = require('node-fetch');
/*
 * TODO: Implement Sanetization
 * TODO: Edit Image should use POST to abstract ID
*/

module.exports.memory = async (req, res, next) => {
  try{
    const results = await functions.getMemoryWithLinks(req.session.token, req.session.dropboxUserID);
    if(results.length > 0){
      res.render("memory", {data: results});
    }else{
     res.redirect("/upload");
    }
  } catch(e) {
   next(e);
  }
}

module.exports.loadMemoryById = async(req, res, next) => {
  const result = await functions.getMemoryById(req.session.token, req.params.mem_id, req.session.dropboxUserID);
  res.json(result)
}

module.exports.postMemoryById = async (req, res, next) => {
  console.log(req.body);
  const mem_id = req.body.infoMask;
  if(req.body.context === "update"){
    const result = await Memory.updateOne(
      { _id: mem_id },
      { $set: {
        title: req.body.infoTitle,
        note: req.body.infoNote
      } }
    );
  } else if(req.body.context === "delete"){
    const promises = [];
    const currentMemory = await Memory.findOne({ _id: mem_id  });
    const dbx = new Dropbox({
                accessToken: req.session.token,
                fetch: fetch
    });
    promises.push(dbx.filesDelete({ path: currentMemory.path_lower }));
    promises.push(Memory.deleteOne({ _id: mem_id  }));
    const result = await Promise.all(promises);
  }
  res.json({
    statusCode: 0,
    status: "Done!"
  })
}
