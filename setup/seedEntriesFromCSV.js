//use console to run: node seedEntriesFromCSV.js

var express = require('express');
var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');
var User = models.User;
var Dict = models.Dictionary;
var Entry = models.Entry;
module.exports = router;

var fs = require('fs');

fs.readFile('german-english-seed.csv', function(err, data){
	if(err) console.error(err);
	else{
		//POPULATE

	//create new user
	return User.findOrCreate({
			// email: 'jonatan@jschumacher.com',
			// firstName: 'Jonatan',
			// lastName: 'Schumacher'
			email: 'daniella.polar@gmail.com',
			firstName: 'Daniella',
			lastName: 'Polar'
		})
		.then(function(user){
			//create new dict
			return Dict.findOrCreate({
				language1: 'German',
				language2: 'English',
				name:'learnGermanFromEnglish',
				userId: user._id.toString()
			})
		})
		.then(function(dict){

			//populate Entries from CSV:
			var rows = data.toString().split('\n');
			var rows = rows.slice(0, rows.length - 1);

			var entries = rows.map(function(r){
				console.log("row:" ,r);
				var values = r.split(',');
				return {
					userId: dict.userId,
					dictId: dict._id.toString(),
					phraseL1: values[0],
					phraseL2: values[1],
					category: values[2],
					level: Number.parseInt(values[3]),
					mnemonic: values[4],
					tags: values[5].split('\r')[0],
				};
			});
			console.log("Obj:", JSON.stringify(entries));

			//then do batch save
			return Entry.create(entries)
			.then(function(){
				console.log("SUCCESS!");
			})
		})
		.then(null, function(err){
			console.error(err);
		})
	}	//end else
}) 