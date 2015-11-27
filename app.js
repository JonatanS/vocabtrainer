var express = require('express');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var logger = require('morgan');
var bodyParser = require('body-parser');
var swig = require('swig');
require('./filters')(swig);	//returns a function from './filters': http://paularmstrong.github.io/swig/docs/filters/
var path = require('path');
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
swig.setDefaults({ cache: false });

app.use(logger('dev'));
// statically serve front-end dependencies
app.use('/',express.static(path.join(__dirname, '/public')));
app.use('/bootstrap',express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
app.use('/jquery',express.static(path.join(__dirname, '/node_modules/jquery/dist')));
console.log('bootstrap path: ' + path.join(__dirname, '/node_modules/bootstrap/dist'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//determine which sub router to use
app.use('/users', require('./routes/users'));
app.use('/dictionaries', require('./routes/dictionaries'));
app.use('/entries', require('./routes/entries'));
app.use('/', require('./routes/index'));

//passport stuff:
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config
var Account = require('./models').Account;
//console.log(Account);
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

console.log(app);
module.exports = app;



// app.get('/', function (req, res) {
//    res.render('index');
// });

//error handler in app.js (4 arguments!)
//.then(null, next) is called in all routes!
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500).send(err.message);
});