var express = require('express');
var router = express.Router();
var models = require('../../../server/models');
var Promise = require('bluebird');
var User = models.User;
var Dict = models.Dictionary;
var Entry = models.Entry;
var QuizEntry = models.QuizEntry;
module.exports = router;


router.get('/', function (req, res, next) {
	console.log(req.params);
	var entries = Entry.find(req.params).select('-__v')
	.then (function (entries) {
		res.send(entries);
	})
});

//POST: /add new entry
router.post('/', function (req, res, next){
	console.log("posting entry:");
	console.log(typeof req.body.user);
	console.log(typeof req.body.dict);
	console.log(req.body);
	return User.findById(req.body.userId)
	.then( function (userObj) {
		return Entry.create({
			user: userObj,
			dictionary: req.body.dict,
			phraseL1: req.body.phraseL1,
			phraseL2: req.body.phraseL2,
			category: req.body.category,
			mnemonic: req.body.mnemonic,
			tags: req.body.tags ? req.body.tags.split(',') : [],
			level: req.body.level
		})
		.then( function (newEntry) {
			res.send(newEntry);
		})
	})
});

router.delete('/:id', function (req, res, next){
	return Entry.findById(req.params.id)
	.then(function(entry){
		entry.remove()
		.then(function(){
			//delete associated quiz entries
			QuizEntry.find({entry: req.params.id}).remove().exec();
	  		res.status(200).end();
		}).then(null, next);
	}).then(null, next);
});

//update entry
router.put('/:id', function (req, res, next){
	console.log(req.body.entry);
	return Entry.findById(req.params.id)
	.then(function(entry){
		var needsSave = false;
		for (var prop in req.body.entry){
			if(entry[prop] != req.body.entry[prop]){
				//update if different
				if(prop == 'tags') {
					entry.tags = req.body.entry.tags ? req.body.entry.tags.split(',') : []
				} else {
					entry[prop] = req.body.entry[prop];
				}
				needsSave = true;
			}
		}
		return entry.save()
		.then(function (entry){
			res.send(entry);
		}).then(null, next);
	}).then(null, next);
});

function getArrayOfParams(dictId){
	console.log('renderDictWithEntries');
	var dict = Dict.findById(dictId);
	var entries = Entry.find({dictId: dictId});
	Promise.all([dict, entries])
	.then(function(dictEntriesArr){
		var dict = dictEntriesArr[0];
		var entries = dictEntriesArr[1];
		var user = User.findById(dict.userId);
		Promise.all([dict, entries, user])
		.then(function(dictEntriesUserArr){
			return dictEntriesUserArr;
		});
	});
}