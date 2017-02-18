const passport = require('passport');

const express = require('express');
const path = require('path');

const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session')
const socketIo = require('socket.io');
const http = require('http');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();
const httpServer = http.Server(app);
const io = socketIo(httpServer);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session( {secret: 'weCodeGood'}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/users', users);

// const ensureLoggedIn = (req, res) => {
//   console.log('req.session.user::', req.session.user)
//   if(!( req.session.user)) {
//     res.redirect('/users/login')
//   }
// }
//
// app.use(ensureLoggedIn)

// app.use(express.static(path.join(__dirname, '..', '..', 'client')));

app.use('/', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  // socket.on('ping', function (data) {
  //   console.log("received ping", data.a);
  //   socket.emit('pong', { frog: 45 })
  // });
  socket.on('jumped', function (data) {
    io.emit( 'jumped', data)
  });

  socket.on('piped', function (data) {
    io.emit( 'piped', data)
  });
  socket.on('signal', function (data) {
    io.emit( 'signal', data)
  });

  socket.on('sendId', function (data) {
    socket.broadcast.emit( 'sendId', data)
  });
});

module.exports = httpServer;
