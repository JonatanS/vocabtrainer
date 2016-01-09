var express = require('express');
var router = express.Router();
var models = require('../../../server/models');
var Promise = require('bluebird');
var Quiz = models.Quiz;
var Dictionary = models.Dictionary;
var Entry = models.Entry;
var QuizEntry = models.QuizEntry;
module.exports = router;

// GET: quizEntries/
router.get('/', function (req, res, next) {
	return QuizEntry.find({}).then(function (quizEntries) {
		res.send(quizEntries);
	}).then(null, next);
});

router.param('id', function (req, res, next, id) {
	//http://stackoverflow.com/questions/14504385/why-cant-you-modify-the-data-returned-by-a-mongoose-query-ex-findbyid
	return quizEntry = QuizEntry.findById(id).lean().select('-__v')	//exclude fields from search
	.populate('entry')
	.exec()
	.then(function (quizEntry) {
		req.quizEntry = quizEntry;
		next();
	})
	.then(null, next);
});

//	GET users/id/
router.get('/:id', function (req, res){
	res.json(req.quizEntry);
});

//POST: /add new quiz
router.post('/', function (req, res, next){
	return QuizEntry.create({
		quiz: req.body.quiz,
		entry: req.body.entry,
		mute: req.body.mute
	})
	.then(function(quizEntry){
		res.status(201).json(quizEntry);
	})
	.then(null, next);
});

router.delete('/:id', function (req, res, next) {
	return QuizEntry.findById(req.params.id)
	.then (function (quizEntry) {
		quizEntry.remove()
		.then( function () {
			res.redirect('/api/quizentries/');
		});
	});
});