var express = require('express');
var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');
var User = models.User;
var Dict = models.Dictionary;
var Entry = models.Entry;

// get /test/
router.get('/', function (req, res) {
	console.log('index!');
   res.render('index', {user : req.user });
});

// get test/about
router.get('/about', function (req, res) {
	console.log('about!');
	res.render('about');
});

module.exports = router;