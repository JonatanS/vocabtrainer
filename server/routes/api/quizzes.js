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
	//http://stackoverflow.com/questions/14504385/why-cant-you-modify-the-data-returned-by-a-mongoose-query-ex-findbyid
	var quiz = Quiz.findById(id).lean().select('-__v');	//exclude fields from search
	var quizEntries = QuizEntry.find({quiz: id});
    Promise.all([quiz, QuizEntries]) 
	.then(function (quizAndQuizEntries) {
		var quiz = quizAndQuizEntries[0];
		quiz.quizEntries = quizAndQuizEntries[1];
		req.quiz = quiz;
		next();
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
		QuizEntry.remove({quiz: req.params.id});	//TODO: test this!
		quiz.remove()
		.then( function () {
			res.redirect('/api/quizzes/');
		})
	})
});


