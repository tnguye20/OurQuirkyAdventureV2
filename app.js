var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// Session management
var config = require("./config");
var redis = require('redis');
var client = redis.createClient();
var crypto = require('crypto');
var session = require('express-session');

// Initialize session
var sess = {
	secret: config.SESSION_ID_SECRET,
  cookie: {}, //add empty cookie to the session by default
  resave: false,
  saveUninitialized: true,
  genid: (req) => {
  	return crypto.randomBytes(16).toString('hex');;
  },
  store: new (require('express-sessions'))({
      storage: 'redis',
      instance: client, // optional
      collection: 'sessions' // optional
  })
}

app.use(session(sess));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
