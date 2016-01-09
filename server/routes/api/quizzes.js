var express = require('express');
var router = express.Router();
var models = require('../../../server/models');
var Promise = require('bluebird');
var Quiz = models.Quiz;
var Dictionary = models.Dictionary;
var Entry = models.Entry;
var QuizEntry = models.QuizEntry;
module.exports = router;

// GET: quizzes/
router.get('/', function (req, res, next) {
	return Quiz.find({}).then(function (quizzes) {
		res.send(quizzes);
	}).then(null, next);
});

// router.param('id', function (req, res, next, id) {
// 	//http://stackoverflow.com/questions/14504385/why-cant-you-modify-the-data-returned-by-a-mongoose-query-ex-findbyid
// 	var quiz = Quiz.findById(id).lean().select('-__v');	//exclude fields from search
// 	//TODO: retrieve quiz entries as find or create with filters
// 	var quizEntries = QuizEntry.find({quiz: id});
//     Promise.all([quiz, QuizEntries]) 
// 	.then(function (quizAndQuizEntries) {
// 		var quiz = quizAndQuizEntries[0];
// 		quiz.entries = quizAndQuizEntries[1];
// 		req.quiz = quiz;
// 		next();
// 	})
// 	.then(null, next);
// });

router.param('id', function (req, res, next, id) {
	return Quiz.findById(id).lean().select('-__v')	//exclude fields from search
	.then(function (quiz){
		var query = {};
		query.dictionary = quiz.dictionary;
		if (quiz.dateFrom) query.dateCreated['$gt'] = quiz.dateFrom;
		if (quiz.dateTo) query.dateCreated['$lt'] = quiz.dateTo;
		if (quiz.filter_levels.length >0) query.level['$in'] = quiz.filter_levels;
		if (quiz.filter_categories.length >0) query.category['$in'] = quiz.filter_categories;
		if (quiz.filter_tags.length >0) query.tags['$in'] = quiz.filter_tags;

		console.log('Query:');
		console.log(query);
		//TODO: retrieve quiz entries as find or create with filters:
		// var fromDate = (quiz.dateFrom ? quiz.dateFrom : new Date(0));
		// var toDate = (quiz.dateTo ? quiz.dateTo : Date.now());
		//1. find all entries 
		return filteredEntries = Entry.find(query)
		.then( function (filteredEntries) {
			console.log('FILTERED ENTRIES:' + filteredEntries.length);
			console.log(filteredEntries);
			var entryIds = filteredEntries.map(function (e) {
				return e._id
			});
			console.log(entryIds);
			// if (typeof entryIds != "Object") entryIds = [entryIds];
			// console.log(entryIds);
			
			//2. use entry ID to find or create quizEntries
			return QuizEntry.findOrCreateMultiple(id, entryIds)
			//return QuizEntry.findOrCreate({quiz: id, entry: {$in: entryIds}})
			.then(function (quizEntries) {
				console.log("Got new-ish QuizEntries:", quizEntries.length)
				quiz.entries = quizEntries;
				req.quiz = quiz;
				next();
			})	
		})
	})

	.then(null, next);
});

//	GET users/id/
router.get('/:id', function (req, res){
	res.json(req.quiz);
});

//POST: /add new quiz
router.post('/', function (req, res, next){
	return Quiz.create({
		dictionary: req.body.dictionary,
		filter: req.body.filter,
		name: req.body.name
	})
	.then(function(quiz){
		res.status(201).json(quiz);
	})
	.then(null, next);
});

router.delete('/:id', function (req, res, next) {
	return Quiz.findById(req.params.id)
	.then (function (quiz) {
		var delE = QuizEntry.remove({quiz: req.params.id});	//TODO: test this!
		var delQ = quiz.remove();
		Promise.all([delE, delQ])
		.then( function (deletedStuff) {
			res.redirect('/api/quizzes/');
		})
	})
});


