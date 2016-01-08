var express = require('express');
var mongoose = require ('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var router = express.Router();
var models = require('../../../server/models');
var Promise = require('bluebird');
var User = models.User;
var Dictionary = models.Dictionary;
var Entry = models.Entry;
var Quiz = models.Quiz;
module.exports = router;

// GET /api/dictionaries
router.get('/', function (req, res, next) {
	var allDictionaries = Dictionary.find({}).select('-__v -dateCreated')
	.then( function (allDicts) {
		res.json(allDicts);
	}).then(null, next);
});

router.post('/', function (req, res, next){
	console.log("Dictionary/add Body:" + JSON.stringify(req.body));
	return Dictionary.create({
		language1: req.body.language1,
		language2: req.body.language2,
		name: req.body.name,
		user: req.body.userId
	})
	.then(function(dict){
		//TODO: create default quizzes
		return createDefaultQuizzes(dict._id)
		.then(function (quizzes) {
			console.log("Quizzes have been created");
			dict.quizzes = quizzes;
	  		res.status(200).end();
			//res.status(201).send(dict);
		}).then(null, next);
	}).then(null, next);	
});

// GET /api/dictionaries/:id
router.param('id', function (req,res,next, id){
	var dict = Dictionary.findById(id).lean().select('-__v -dateCreated');
	var entries = Entry.find({dictionary: id}).select('-__v');
	var quizzes = Quiz.find({dictionary: id});
	Promise.all([dict, entries, quizzes])
	.then(function(dictEntriesArr){
		var dict = dictEntriesArr[0];
		var entries = dictEntriesArr[1];
		var quizzes = dictEntriesArr[2];
		dict.entries = entries;
		dict.quizzes = quizzes;
		req.dictionary = dict;
		next();
	})
	.then(null, next);
});

router.get('/:id', function (req, res) {
	res.json(req.dictionary);
});

router.delete('/:id', function (req, res, next){
	return Dictionary.findById(req.params.id)
	.then(function(dict){
		var delE = Entry.remove({dictionary: req.params.id});
		var delQ = Quiz.remove({dictionary: req.params.id});
		var delD = dict.remove()
		Promise.all([delE, delD, delQ])
		.then(function (deletedStuff){
	  		res.status(200).end();
		}).then(null, next);
	}).then(null, next);
});

var createDefaultQuizzes = function(dictId) {
	var quiz1 = Quiz.create({
		dictionary: dictId,
		name: "last two weeks",
		filter_weekFrom: 2
	});

	var quiz2 = Quiz.create({
		dictionary: dictId,
		name: "last 10 weeks",
		filter_weekFrom: 10
	});

	var quiz3 = Quiz.create({
		dictionary: dictId,
		name: "levels 1-2",
		filter_levels: [1,2]
	});

	var quiz4 = Quiz.create({
		dictionary: dictId,
		name: "nouns only",
		filter_categories: ['noun']
	});

	var quiz5 = Quiz.create({
		dictionary: dictId,
		name: "entire dictionary"
	});
	console.log("creating quizzes 1-5 now");
	//must return a promise!
    return Promise.all([quiz1,quiz2,quiz3,quiz4,quiz5]);
};