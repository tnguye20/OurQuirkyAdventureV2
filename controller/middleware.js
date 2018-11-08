
// Session Redirect
module.exports.isSession = (req, res, next) => {
  if(req.session.pen !== true && (req.session.token == undefined || req.session.token === "")){
    res.redirect("/");
  }else{
    next();
  }
}

module.exports.isSessionSoft = (req, res, next) =>{
  if(req.session.pen !== true){
    res.redirect("/");
  }else{
    next();
  }
}
