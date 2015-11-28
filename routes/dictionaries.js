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

router.post('/add', function (req, res, next){

	console.log("Dict/add Body:" + JSON.stringify(req.body));
	return Dict.create({
		language1: req.body.language1,
		language2: req.body.language2,
		name: req.body.name,
		userId: req.body.userId
	})
	.then(function(dict){
		//if successful:
		res.render('entry/entriesListView', {dictionary: dict, entries: {}, info:{type: "successful", 
			message:"Successfully created the new dictionary: dict.name"}});

	}).then(null, next);	
});