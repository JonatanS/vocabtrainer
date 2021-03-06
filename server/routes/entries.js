var express = require('express');
var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');
var User = models.User;
var Dict = models.Dictionary;
var Entry = models.Entry;
module.exports = router;

//POST: /add new entry
router.post('/add', function (req, res, next){
	console.log("Entry/add Body:" + JSON.stringify(req.body));
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
			var paramsArr = getArrayOfParams(req.body.dictId);

			var dict = paramsArr[0];
			var entries = paramsArr[1];
			var user = paramsArr[2];
			console.log("DICT: "+ JSON.stringify(dict));
	    	res.render('entry/entriesListView', {dictionary: dict, entries: entries, user: user});
});

router.get('/:entryId/:dictId/delete', function (req, res, next){
	console.log("remove entry " + req.params.entryId);
	return Entry.findById(req.params.entryId)
	.then(function(entry){
		console.log("Entry:" + entry);
		entry.remove()
		.then(function(){
			var paramsArr = getArrayOfParams(req.params.dictId);

			var dict = paramsArr[0];
			var entries = paramsArr[1];
			var user = paramsArr[2];
			console.log("DICT: "+ JSON.stringify(dict));
			console.log("USER: "+ JSON.stringify(user));
			console.log("ENTRIES: "+ JSON.stringify(entries));
	    	res.render('entry/entriesListView', {dictionary: dict, entries: entries, user: user});
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