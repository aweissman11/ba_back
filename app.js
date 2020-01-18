// TODO: Update cors to handle my specific routing
const createError = require('http-errors');
const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const cors = require('cors');

const bodyParser = require('body-parser');
const compression = require('compression');

const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const app = express();


function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH,   DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,   Content-Type, Accept");
  next()
}
app.use(allowCrossDomain)
app.use(cors());
// var allowedOrigins = [
//   'http://localhost:3001',
//   'http://chelseyandaaronsbigadventure.com',
//   'http://bigadventureapi-env.us-west-2.elasticbeanstalk.com',
//   'http://localhost:3000'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     console.log('origin :', origin);
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       var msg = 'The CORS policy for this site does not ' +
//         'allow access from the specified Origin: ' + origin;
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(compression());
app.use(bodyParser.json());

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// // app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
