var express = require('express');
var router = express.Router();
var models = require('../../../server/models');
var Promise = require('bluebird');
var User = models.User;
var Dict = models.Dictionary;
var Entry = models.Entry;
module.exports = router;


router.get('/', function (req, res, next) {
	var entries = Entry.find({}).select('-__v')
	.then (function (entries) {
		res.send(entries);
	})
});

//POST: /add new entry
router.post('/', function (req, res, next){
	var newEntry = Entry.create({
		userId: req.body.userId,
		dictId: req.body.dictId,
		phraseL1: req.body.phraseL1,
		phraseL2: req.body.phraseL2,
		category: req.body.category,
		mnemonic: req.body.mnemonic,
		tags: req.body.tags.split(','),
		level: req.body.level
	});
	//all data is updated:
	var paramsArr = getArrayOfParams(req.body.dictId);			var dict = paramsArr[0];
	var entries = paramsArr[1];
	res.send(entries);
});

router.delete('/:id', function (req, res, next){
	return Entry.findById(req.params.id)
	.then(function(entry){
		console.log("Entry to delete:" + entry);
		entry.remove()
		.then(function(){
			// var paramsArr = getArrayOfParams(req.params.dictId);
			// //var dict = paramsArr[0];
			// var entries = paramsArr[1];
			// //var user = paramsArr[2];
	  		//res.send(entries);
	  		res.redirect('/api/dictionaries/' + req.params.dictId);
		})
	.then(null, next);
	})
	.then(null, next);
});

function getArrayOfParams(dictId){
	console.log('renderDictWithEntries');
	var dict = Dict.findById(dictId);
	var entries = Entry.find({dictId: dictId});
	Promise.all([dict, entries])
	.then(function(dictEntriesArr){
		var dict = dictEntriesArr[0];
		console.log("Dict:" + dict);
		var entries = dictEntriesArr[1];
		var user = User.findById(dict.userId);
		Promise.all([dict, entries, user])
		.then(function(dictEntriesUserArr){
			return dictEntriesUserArr;
		});
	});
}