var express = require('express');
var router = express.Router();
var controller = require('../controller');
var middleware = require('../controller/middleware');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.pen !== true){
    res.render('index', { title: 'Our Quirky Adventure v2' });
  } else {
    res.redirect("/app");
  }
});

router.get('/app', middleware.isSession, controller.home);
router.post('/verify', controller.verify);
router.get('/login', controller.login);
router.get('/oauthredirect', controller.oauthredirect);
router.get("/upload", middleware.isSession, controller.upload);
router.post("/upload", middleware.isSession, controller.uploadDB);
router.get("/logout", middleware.isSession, controller.logout);

router.get("/*", middleware.isSession, (req, res , next) => { res.redirect("/"); });

module.exports = router;
