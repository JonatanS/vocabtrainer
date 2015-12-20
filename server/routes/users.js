var express = require('express');
var mongoose = require ('mongoose');

var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');
var User = models.User;
var Dict = models.Dictionary;
var Entry = models.Entry;
module.exports = router;

//global variable:
var currentUser;

//TODO: THIS IS TEMPORARY FUNCTIONALITY UNTIL 
//		PASSPORT AUTHENTICATION IS IN PLACE

//	GET users/emailLookup
router.get('/emailLookup', function (req, res, next){
	//console.log("here: ");
	var user = User.findOne({email: req.query.email}).exec();
	return user
	.then(function(user){
		//grab their dicts
		console.log(user);
		res.redirect('/users/'+ user._id);
		return [user, Dict.find({user: user})];
	})
	.then(null, next);	//call next in case of error
});


//POST: /add new user
router.post('/add', function (req, res, next){
	return User.create({
		email: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName
	})
	.then(function(user){
		// go to their dicts page:
		res.render('user/userDicts', {user: user, dictionaries: [{}]});
	})
	.then(null, next);
});


//THIS SHOULD BE AT THE BOTTOM:
//	GET users/userId/
router.get('/:userId', function (req, res, next){

	var findUser = User.findById(req.params.userId);
	var findDicts = Dict.find({userId: req.params.userId});

    Promise.all([findUser, findDicts])  
    .then(function (info) {
        var foundUser = info[0];
        var foundDicts = info[1];
        //set currentUser
        currentUser = foundUser;
        console.log("user: ", currentUser);
        res.render('user/userDicts', {
            dictionaries: foundDicts,
            user: foundUser
        });
    })
    .then(null, next);
});

