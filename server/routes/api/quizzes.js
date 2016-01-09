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

router.param('id', function (req, res, next, id) {
	return Quiz.findById(id).lean().select('-__v')	//exclude fields from search
	.then(function (quiz){
		var query = {};
		query.dictionary = quiz.dictionary;
		if (quiz.dateFrom) query['dateCreated'] = {$gt : quiz.dateFrom};
		if (quiz.dateTo) {
			if (query['dateCreated']) query['dateCreated']['$lt'] = quiz.dateTo;
			else query['dateCreated'] = {$lt : quiz.dateTo};
		}
		if (quiz.filter_levels.length >0) query['level'] = {$in : quiz.filter_levels};
		if (quiz.filter_categories.length >0) query['category'] = {$in : quiz.filter_categories};		if (quiz.filter_tags.length >0) query.tags['$in'] = quiz.filter_tags;

		return filteredEntries = Entry.find(query)
		.then( function (filteredEntries) {
			var entryIds = filteredEntries.map(function (e) {
				return e._id
			});
			//2. use entry ID to find or create quizEntries
			return QuizEntry.findOrCreateMultiple(id, entryIds)
			.then(function (quizEntries) {
				//filter out muted entries
				quiz.entries = quizEntries.filter(function (e) {
					return e.mute === false;
				});
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
