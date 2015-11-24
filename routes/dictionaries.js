var express = require('express');
var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');
var User = models.User;
var Dict = models.Dictionary;
var Entry = models.Entry;
module.exports = router;


// GET dictionaries/dictId
router.get('/:dictId/listView', function (req,res,next){
var dict = Dict.findById(req.params.dictId);
	var entries = Entry.find({dictId: req.params.dictId})

	Promise.all([dict, entries])
	.then(function(dictEntriesArr){
		var dict = dictEntriesArr[0];
		var entries = dictEntriesArr[1];
		console.log("DICT: "+ JSON.stringify(dict));
		res.render('entry/entriesListView', {dictionary: dict, entries: entries});
	})
	.then(null, next);
});
