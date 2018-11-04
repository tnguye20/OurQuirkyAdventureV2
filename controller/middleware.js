
// Session Redirect
module.exports.isSession = (req, res, next) => {
  if(req.session.pen !== true){
    res.redirect("/");
  }else{
    next();
  }
}
