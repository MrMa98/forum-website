var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const fileUpload = require('express-fileupload');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 设置允许跨域访问的来源
const allowedOrigin = 'http://127.0.0.1:3001'; // 更改为你允许的来源地址

// 使用 CORS 中间件并配置
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  path: '/',
  name: 'sid',
  secret: 'mzw',
  saveUninitialized: false,
  resave: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/admin',
    touchAfter: 24 * 3600,
  }),
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 1000 * 60 * 60 * 60
  }
}));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use('/api', indexRouter);
app.use('/user', loginRouter);
app.use('/user', registerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404);
  res.render('notfound');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
