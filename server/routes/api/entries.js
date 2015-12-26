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
	console.log("posting");
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
			console.log('created: ' + JSON.stringify(newEntry));
			res.send(newEntry);
		})
	})
});

router.delete('/:id', function (req, res, next){
	return Entry.findById(req.params.id)
	.then(function(entry){
		console.log("deleting entry:" + entry);
		entry.remove()
		.then(function(){
	  		res.status(200).end();
		}).then(null, next);
	}).then(null, next);
});

//update entry
router.put('/:id', function (req, res, next){
	return Entry.findById(req.params.id)
	.then(function(entry){
		console.log("in put:" + entry._id);
		var needsSave = false;
		console.log(req.body);
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
			console.log("after safe: " + JSON.stringify(entry));
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
		console.log("Dict:" + dict);
		var entries = dictEntriesArr[1];
		var user = User.findById(dict.userId);
		Promise.all([dict, entries, user])
		.then(function(dictEntriesUserArr){
			return dictEntriesUserArr;
		});
	});
}