const crypto     = require("crypto"),
      config     = require("./config"),
      NodeCache  = require('node-cache')
      rp         = require('request-promise');
var mycache = new NodeCache();

const upload = require('./controller/upload');
const memory = require('./controller/memory');
const gallery = require('./controller/gallery');
const functions = require('./controller/functions');

module.exports.upload = upload.upload;
module.exports.uploadDB = upload.uploadDB;
module.exports.memory = memory.memory;

module.exports.verify = (req, res, next) => {
  if(req.body.pass == "success"){
    req.session.pen = true;
    res.send(true);
  }else{
    res.send(false);
  }
}

module.exports.gallery = gallery.gallery;

module.exports.home = async (req, res, next) => {
    let token = req.session.token;
    if ( token ) {
      // try{
      //   let paths = await functions.getLinksAsync(token);
      //   if(paths.length > 0){
      //     res.render("gallery", {imgs: paths, layout: false});
      //   }else{
      //     res.send({notice: "No Image Available"});
      //   }
      // }catch(error){
      //   return next(new Error("Something went wrong when trying to retrieve token"));
      // }
      res.redirect("/memory");
    } else {
      res.redirect('/login');
    }
};

module.exports.login = (req, res, next) => {
  // create a random state
  let state = crypto.randomBytes(16).toString("hex");

  // save state and session for 10 minutes
  mycache.set(state, req.sessionID, 600);

  let dbxRedirect= config.DBX_OAUTH_DOMAIN
      + config.DBX_OAUTH_PATH
      + "?response_type=code&client_id="+config.DBX_APP_KEY
      + "&redirect_uri="+config.OAUTH_REDIRECT_URL
      + "&state="+state;

  res.redirect(dbxRedirect);;
}

module.exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) { 
      next(err);
    } else {
      res.redirect("/");
    }
  });
}

module.exports.oauthredirect = async (req, res, next) => {
  if(req.query.error_description){
		return next( new Error(req.query.error_description));
	}

	let state= req.query.state;

  if(mycache.get(state) != req.sessionID){
    return next(new Error("session expired or invalid state"));
  }

  // Exchange for token
  if(req.query.code){
    let options={
  		url: config.DBX_API_DOMAIN + config.DBX_TOKEN_PATH,
      //build query string
      qs: {'code': req.query.code,
      'grant_type': 'authorization_code',
      'client_id': config.DBX_APP_KEY,
      'client_secret':config.DBX_APP_SECRET,
      'redirect_uri':config.OAUTH_REDIRECT_URL},
       method: 'POST',
      json: true
    }

    try{
      let response = await rp(options);
      await functions.regenerateSessionAsync(req);
      req.session.token = response.access_token;
      req.session.pen = true;
      res.redirect('/app');
    } catch (error) {
      return next(new Error("error getting token. " + error.message));
    }
  }
};
