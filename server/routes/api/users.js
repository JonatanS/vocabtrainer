var express = require('express');
var router = express.Router();
var models = require('../../../server/models');
var Promise = require('bluebird');
var User = models.User;
var Dictionary = models.Dictionary;
var Entry = models.Entry;
module.exports = router;


//	GET: users/
router.get('/', function (req, res, next) {
	return User.find({}).then(function(users){
		res.send(users);
	}).then(null, next);
});

router.param('id', function (req, res, next, id) {
	//http://stackoverflow.com/questions/14504385/why-cant-you-modify-the-data-returned-by-a-mongoose-query-ex-findbyid
	var user = User.findById(id).lean().select('-__v -dateRegistered');	//exclude fields from search
	var userDicts = Dictionary.find({user: id});
    Promise.all([user, userDicts]) 
	.then(function (userAndDicts) {
		var user = userAndDicts[0];
		user.dictionaries = userAndDicts[1];
		req.user = user;
		next();
	})
	.then(null, next);
});

//	GET users/id/
router.get('/:id', function (req, res){
	res.json(req.user);
});


//POST: /add new user
router.post('/', function (req, res, next){
	return User.create({
		email: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName
	})
	.then(function(user){
		res.status(201).json(user);
	})
	.then(null, next);
});

router.delete('/:id', function (req, res, next) {
	return User.findById(req.params.id)
	.then (function (user) {
		user.remove()
		.then( function () {
			res.redirect('/api/users/');
		})
	})
});

String.prototype.toObjectId = function() {
  var ObjectId = (require('mongoose').Types.ObjectId);
  return new ObjectId(this.toString());
};
