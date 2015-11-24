var express = require('express');
var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');
var User = models.User;
var Dict = models.Dictionary;
var Entry = models.Entry;
module.exports = router;

//TODO: Take out functionality - separate add view from list view.
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
	var dict = Dict.findById(req.body.dictId);
	var entries = Entry.find({dictId: req.body.dictId})
	console.log("new Entry:",newEntry);

	Promise.all([dict, entries])
	.then(function(dictEntriesArr){
		if(req.body.continueAdding) {
			var dict = dictEntriesArr[0];
			var entries = dictEntriesArr[1];
			console.log("DICT: "+ JSON.stringify(dict));
    		res.render('entry/entriesListView', {dictionary: dict, entries: entries});
		}
	})
	.then(null, next);
});