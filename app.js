const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const serializeError = require('serialize-error')

// router
const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json({limit: '60mb'}))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', indexRouter);

app.use(function(req, res, next) {
  res.render('error/404', {main: "404", sub: "페이지를 찾을 수 없습니다"});
});
// console.log(app._router.stack);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  
  let status = err.status && !isNaN(err.status) ? err.status : 500
  let errorMessage

  if (err.errorMessage instanceof Error) {
    try {
      err.errorMessage = serializeError(err.errorMessage)
    }
    catch (error) {
      err.errorMessage = error
    }
  }
  else if (typeof err === 'string') {
    err = {errorMessage: err}
  }
  else if (typeof err === 'object') {
    try {
      err = serializeError(err)
    }
    catch (error) {
      err = error
    }
  }
  if (!errorMessage && req.app.get('env') === 'production') {
    if (errorMessage) delete errorMessage.stack
  }
  console.log(err)
  delete err.status
  return res.status(status || 500).json(serializeError(err) || {})

});

module.exports = app;
