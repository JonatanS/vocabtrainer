var express = require('express');
var app = express();

var logger = require('morgan');
var bodyParser = require('body-parser');
var swig = require('swig');
require('./filters')(swig);	//returns a function from './filters': http://paularmstrong.github.io/swig/docs/filters/
var path = require('path');
module.exports = app;

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

// app.get('/', function (req, res) {
//    res.render('index');
// });

//error handler in app.js (4 arguments!)
//.then(null, next) is called in all routes!
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500).send(err.message);
});