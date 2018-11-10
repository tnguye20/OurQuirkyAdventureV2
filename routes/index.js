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
router.get('/login', middleware.isSessionSoft, controller.login);
router.get('/oauthredirect', middleware.isSessionSoft, controller.oauthredirect);
router.get("/upload", middleware.isSession, controller.upload);
router.get("/memory", middleware.isSession, controller.memory);
router.get("/memory/:mem_id", middleware.isSession, controller.loadMemoryById);
router.post("/memory/:mem_id", middleware.isSession, controller.postMemoryById);
router.get("/gallery", middleware.isSession, controller.gallery);
router.post("/upload", middleware.isSession, controller.uploadDB);
router.get("/logout", middleware.isSession, controller.logout);

router.get("/*", middleware.isSession, (req, res , next) => { res.redirect("/"); });

module.exports = router;
