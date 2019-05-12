const crypto     = require("crypto"),
      config     = require("./config"),
      NodeCache  = require('node-cache')
      rp         = require('request-promise'),
      mycache    = new NodeCache();

const User = require("./models/user");
const upload = require('./controller/upload');
const memory = require('./controller/memory');
const gallery = require('./controller/gallery');
const functions = require('./controller/functions');

module.exports.upload = upload.upload;
module.exports.uploadDB = upload.uploadDB;
module.exports.memory = memory.memory;
module.exports.loadMemoryById = memory.loadMemoryById;
// module.exports.postMemoryById = memory.postMemoryById;
module.exports.putMemoryById = memory.putMemoryById;
module.exports.deleteMemoryById = memory.deleteMemoryById;

module.exports.verify = (req, res, next) => {
  passPhrase = req.body.passPhrase;
  if (passPhrase === config.passPhrase){
    req.session.pen = true
    res.send(true)
  } else {
    res.send(false)
  }
}

module.exports.gallery = gallery.gallery;

module.exports.home = async (req, res, next) => {
    let token = req.session.token;
    if ( token ) {
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

module.exports.logout = async (req,res,next)=>{
  try{

    await destroySessionAsync(req);
    res.redirect("/");

  }catch(error){
    return next(new Error('error logging out. '+error.message));
  }
}

//Returns a promise that fulfills when a session is destroyed
function destroySessionAsync(req){
  return new Promise(async (resolve,reject)=>{

    try{

      //First ensure token gets revoked in Dropbox.com
      let options={
        url: config.DBX_API_DOMAIN + config.DBX_TOKEN_REVOKE_PATH,
        headers:{"Authorization":"Bearer "+req.session.token},
        method: 'POST'
      }
      let result = await rp(options);

    }catch(error){
      reject(new Error('error destroying token. '));
    }

    //then destroy the session
    req.session.destroy((err)=>{
      err ? reject(err) : resolve();
    });
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

      const userObjectId = response.account_id;

      // Check User Existence
      const isExist = await User.findOne({
        dropboxUserID: userObjectId
      }).count();

      if(isExist === 1){
        // User Exist, Update Last Login
        await User.findOneAndUpdate({
         dropboxUserID : userObjectId
        }, {
          lastLogin: Date.now()
        });
      } else {
        // New User, Proceed to add
        const newUser = new User({
          dropboxUserID: userObjectId,
          lastLogin: Date.now(),
          lastModified: Date.now()
        });

        await newUser.save();
      }

      req.session.pen = true;
      req.session.dropboxUserID = userObjectId;
      res.redirect('/app');
    } catch (error) {
      return next(new Error("error getting token. " + error.message));
    }
  }
};
