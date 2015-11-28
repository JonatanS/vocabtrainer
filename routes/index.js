var express = require('express');
var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');
//passport stuff
// var passport = require('passport');
// var Account = models.Account;	//make sure this works
var User = models.User;
var Dict = models.Dictionary;
var Entry = models.Entry;


router.get('/', function (req, res) {
	console.log('index!');
   res.render('index', {user : req.user });
});

// router.get('/register', function (req, res) {
// 	console.log('register!');
// 	console.log(req.user);
// 	res.render('register');
// });

// router.post('/register', function(req, res) {
//     Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
//       if (err) {
//           return res.render("register", {info: "Sorry. That username already exists. Try again."});
//         }

//         passport.authenticate('local')(req, res, function () {
//             res.redirect('/');
//         });
//     });
// });

// router.post('/register', function (req, res) {
// 		return User.create({
// 		email: req.body.email,
// 		//passwort: req.body.password,
// 		firstName: req.body.firstName,
// 		lastName: req.body.lastName
// 	})
// 	.then(function(user){
//         passport.authenticate('local')(req, res, function () {
//         res.redirect('/');
//         });
// 	}, function(){
// 		//if unsuccesful:
// 		return res.render('register', { user : user });
// 	})
// 	.then(null, next);
// });

// router.get('/login', function(req, res) {
//     res.render('login', { user : req.user });
// });

// router.post('/login', passport.authenticate('local'), function(req, res) {
//     res.redirect('/');
// });

// router.get('/logout', function(req, res) {
//     req.logout();
//     res.redirect('/');
// });

// router.get('/ping', function(req, res){
//     res.status(200).send("pong!");
// });

router.get('/about', function (req, res) {
	console.log('about!');
	res.render('about');
});





module.exports = router;