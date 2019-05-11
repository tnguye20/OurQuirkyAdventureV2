const express = require('express');
const router = express.Router();
const controller = require('../controller');
const middleware = require('../controller/middleware');

/* Middlewares to handle multipart/form-data  */
const multer = require('multer');
const upload = multer();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.pen !== true){
    res.render('index', { title: 'Our Quirky Adventure' });
  } else {
    res.redirect("/app");
  }
});

router.get('/app', middleware.isSession, controller.home);
router.post('/verify', upload.none(), controller.verify);
router.get('/login', middleware.isSessionSoft, controller.login);
router.get('/oauthredirect', middleware.isSessionSoft, controller.oauthredirect);
router.get("/upload", middleware.isSession, controller.upload);
router.get("/memory", middleware.isSession, controller.memory);
router.get("/memory/:mem_id", middleware.isSession, controller.loadMemoryById);
router.post("/memory/:mem_id", middleware.isSession, controller.postMemoryById);
router.get("/gallery", middleware.isSession, controller.gallery);
router.get("/logout", middleware.isSession, controller.logout);

router.post("/upload", middleware.isSession, upload.array('memoryUpload'), controller.uploadDB);

router.get("/*", middleware.isSession, (req, res , next) => { res.redirect("/"); });

module.exports = router;
