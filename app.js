var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();

/**
 * Socket.io set up
 */

var socket_io = require('socket.io');
var io = socket_io();
app.io = io;

var indexRouter = require('./routes/index')(io);
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api')(io);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// set-up database
var mongoose = require('mongoose');
mongoose.connect('mongodb://bart:20BarT01@ds255329.mlab.com:55329/m2w');
var db = mongoose.connection;

// check connection
db.once('open', function () {
    console.log('Connected to MongoDB');
});

db.on('error', function (err) {
    console.log(err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/apple-touch-icon-precomposed.png', (req, res) => res.status(204));
app.get('/apple-touch-icon.png', (req, res) => res.status(204));

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
