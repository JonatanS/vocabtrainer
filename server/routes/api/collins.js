var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var Collins = require('collins');
var serverName = 'api.collinsdictionary.com';
var configAuth = require('../../../config/secrets');
var accessKey = configAuth.collinsAuth.apikey;
var parseString = require('xml2js').parseString;
module.exports = router;

var d = new Collins(serverName, accessKey);
var languages = ['english', 'german', 'italian', 'french', 'spanish'];

router.get('/dictionaries', function (req, res, next) {
	d.dictionaries( function (err, data) {
		if (err) console.error(err);
		res.json(data);
	});
});

//Dont think I need this:
// router.get('/dictionaries/:language1/:language2', function (req, res, next) {
// 	if (languages.indexOf(req.params.language1)== -1 || languages.indexOf(req.params.language2)== -1) {
// 		res.status(404).end();
// 	}

// 	return d.dictionary(req.params.language1 + '-' + req.params.language2,function (err, data) {
// 		if (err) console.error(err);
// 		res.json(data);
// 	});
// });


router.get('/dictionaries/search', function (req, res, next) {
	var l1 = req.query.language1.toLowerCase();
	var l2 = req.query.language2.toLowerCase();
	var phrase = req.query.phrase;

	if (languages.indexOf(l1)== -1 || languages.indexOf(l2)== -1) {
		res.status(404).end();
	}
	console.log(l1,l2,phrase)
	var derDieDas = ['der', 'die', 'das'];
	var tempArr = phrase.split(' ');
	console.log('tempArr: ', tempArr);
	if (tempArr.length > 1 && derDieDas.indexOf(tempArr[0]) !== -1) {
		tempArr.splice(0,1);
		console.log(tempArr);
		phrase = tempArr.join(' ');
	}
	return d.search(l1 + '-' + l2, phrase,function (err, data) {
		if (err) console.error(err);
		console.log(data.results[0]);
		if(!data.results[0]) res.status(404).end();
		d.entry(l1 + '-' + l2, data.results[0]['entryId'], 'xml', function (err, entries) {
			if (err) console.error(err);
			console.log(entries);			
			parseString(entries.entryContent, function (err, result) {
				console.log(result);
    			res.send(result);
			});
			//res.send(entries);
		})
	});
});
