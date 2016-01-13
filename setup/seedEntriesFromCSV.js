//use console to run: node seedEntriesFromCSV.js

var express = require('express');
var router = express.Router();
var models = require('../server/models');
var Promise = require('bluebird');
var User = models.User;
var Dict = models.Dictionary;
var Entry = models.Entry;
var Quiz = models.Quiz;
module.exports = router;

var fs = require('fs');

fs.readFile('german-english-seed.csv', function(err, data){
	if(err) console.error(err);
	else{
		//POPULATE

	//create new user
	return User.findOrCreate({
			email: 'jonatan@jschumacher.com',
			firstName: 'Jonatan',
			lastName: 'Schumacher'
			// email: 'daniella.polar@gmail.com',
			// firstName: 'Dani',
			// lastName: 'Schumi'
		})
		.then(function(user){
			//create new dict
			return Dict.findOrCreate({
				language1: 'German',
				language2: 'English',
				//name:user.firstName + '-German-English',
				name:'dict with quizzes',
				user: user._id
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
					user: dict.user,
					dictionary: dict._id,
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
			.then(function(entries){
				//create quizzes here:
				return createDefaultQuizzes(entries[0].dictionary)
				.then(function (quizzes){
					console.log("SUCCESS!");
				})
			})
		})
		.then(null, function(err){
			console.error(err);
		})
	}	//end else
}); 

var createDefaultQuizzes = function(dictId) {
	var quiz1 = Quiz.create({
		dictionary: dictId,
		name: "last two weeks",
		filter_weekFrom: 2
	});

	var quiz2 = Quiz.create({
		dictionary: dictId,
		name: "last 10 weeks",
		filter_weekFrom: 10
	});

	var quiz3 = Quiz.create({
		dictionary: dictId,
		name: "levels 1-2",
		filter_levels: [1,2]
	});

	var quiz4 = Quiz.create({
		dictionary: dictId,
		name: "nouns only",
		filter_categories: ['noun']
	});

	var quiz5 = Quiz.create({
		dictionary: dictId,
		name: "entire dictionary"
	});
	console.log("creating quizzes 1-5 now");
	//must return a promise!
    return Promise.all([quiz1,quiz2,quiz3,quiz4,quiz5]);
};