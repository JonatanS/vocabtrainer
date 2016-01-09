var express = require('express');
var app = express();
var mongoose = require('mongoose');

// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;

var logger = require('morgan');
var bodyParser = require('body-parser');
var swig = require('swig');
require('../non-angular-public/filters')(swig);	//returns a function from './filters': http://paularmstrong.github.io/swig/docs/filters/
var path = require('path');
console.log("dir:" + __dirname);
app.set('views', path.join(__dirname, '../non-angular-public/views'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
swig.setDefaults({ cache: false });


app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// The path of our public directory. ([ROOT]/public)
var publicPath = path.join(__dirname, '../public');
var bootstrapPath = path.join(__dirname, '../node_modules/bootstrap/dist')
var indexHtmlPath = path.join(__dirname, '../public/index.html');

// //passport stuff:
// app.use(require('express-session')({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());


// // passport config
// var Account = require('./models').Account;
// //console.log(Account);
// passport.use(new LocalStrategy(Account.authenticate()));
// passport.serializeUser(Account.serializeUser());
// passport.deserializeUser(Account.deserializeUser());


//ROUTES NEED TO BE DEFINED AFTER THE PASSPORT STUFF:
app.use(express.static(publicPath));
//app.use(express.static(bootstrapPath));
app.get('/', function (req, res) {
    res.sendFile(indexHtmlPath);	//angular default html
});
//determine which sub router to use
app.use('/test/users', require('./routes/users'));
app.use('/test/dictionaries', require('./routes/dictionaries'));
app.use('/test/entries', require('./routes/entries'));
app.use('/test/', require('./routes'));

app.use('/api', require('./routes/api/index'));

// statically serve front-end dependencies
app.use('/',express.static(path.join(__dirname, '../non-angular-public/public')));
app.use('/bootstrap',express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
app.use('/jquery',express.static(path.join(__dirname, '../node_modules/jquery/dist')));

module.exports = app;

//error handler in app.js (4 arguments!)
//.then(null, next) is called in all routes!
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500).send(err.message);
});