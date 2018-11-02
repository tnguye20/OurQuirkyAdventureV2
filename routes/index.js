var express = require('express');
var router = express.Router();
var controller = require('../controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Our Quirky Adventure v2' });
});

router.get('/login', controller.login);

module.exports = router;
