const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const app = express();

// Session management
const config = require("./config");
const crypto = require('crypto');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// MongoDB
const  mongoose = require('mongoose');
mongoose
  .connect("mongodb://drakexavior:2c2SIviQS8gQ@ds151393.mlab.com:51393/ourquirkyadventure", { useNewUrlParser: true  })
  .then( () => { console.log("MongoDB Connection Established") } )
  .catch( err => { console.error("Connection Fail:" + err.message)  } )
const db = mongoose.connection;

// Initialize session
const sess = {
	secret: config.SESSION_ID_SECRET,
  cookie: {}, //add empty cookie to the session by default
  resave: false,
  saveUninitialized: true,
  genid: (req) => {
  	return crypto.randomBytes(16).toString('hex');;
  },
  store: new MongoStore({
    mongooseConnection: db
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
