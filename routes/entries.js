var express = require('express');
var mongoose = require ('mongoose');

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
		phraseL1: req.body.phraseL1,
		phraseL2: req.body.phraseL2,
		category: req.body.category,
		mnemonic: req.body.mnemonic,
		tags: req.body.tags.split(','),
		level: req.body.level
	});
	var dict = Dict.findById(req.body.dictId);
	console.log("new Entry:",newEntry);
	Promise.all([dict, newEntry])
	.then(function(info){
		//add entry to dict:
		var updatedDict = info[0];
		updatedDict.entries.push(info[1]);
		//console.log("dict with entries: "+ JSON.stringify(updatedDict));
		return updatedDict.save();
	})
	.then(function(dict){
		if(req.body.continueAdding) {
		console.log("DICT with entries: "+ JSON.stringify(dict));
		console.log("dict with ENTRIES: "+ JSON.stringify(dict.entries));
    		res.render('entry/entriesListView', {dictionary: dict});
		}
		else{
			var findUser = User.findById(req.body.userId);
			var findDicts = Dict.find({userId: req.body.userId});

		    Promise.all([findUser, findDicts])  
		    .then(function (info) {
		    	console.log("info data" + info);
		        var foundUser = info[0];
		        var foundDicts = info[1];
		        res.render('user/userDicts', {
		            dictionaries: foundDicts,
		            user: foundUser
		        });
		    })
		    .then(null, next);
		}
	});
});