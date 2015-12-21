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
module.exports = router;

// GET /api/dictionaries
router.get('/', function (req, res, next) {
	var allDictionaries = Dictionary.find({}).select('-__v -dateCreated')
	.then( function (allDicts) {
		res.json(allDicts);
	}).then(null, next);
});

// GET /api/dictionaries/:id
router.param('id', function (req,res,next, id){
	var dict = Dictionary.findById(id).lean().select('-__v -dateCreated');
	var entries = Entry.find({dictionary: id}).select('-__v');
	Promise.all([dict, entries])
	.then(function(dictEntriesArr){
		var dict = dictEntriesArr[0];
		var entries = dictEntriesArr[1];
		console.log('found num entries: '+ entries.length);
		dict.entries = entries;
		req.dictionary = dict;
		next();
	})
	.then(null, next);
});

router.get('/:id', function (req, res) {
	res.json(req.dictionary);
})

router.post('/', function (req, res, next){
	console.log("Dictionary/add Body:" + JSON.stringify(req.body));
	return Dictionary.create({
		language1: req.body.language1,
		language2: req.body.language2,
		name: req.body.name,
		userId: req.body.userId
	})
	.then(function(dict){
		res.status(201).send(dict);

	}).then(null, next);	
});