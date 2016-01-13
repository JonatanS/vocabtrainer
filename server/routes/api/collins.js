var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var Collins = require('collins');
var serverName = 'api.collinsdictionary.com';
var configAuth = require('../../../config/secrets');
var accessKey = configAuth.collinsAuth.apikey;
var parser = require('xml2json');
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
var parserOptions = {
    object: true,
    // sanitize: false,
    trim: false,
    // reversible: true,
    coerce: true,       
    // arrayNotation: true
};

router.get('/dictionaries/search', function (req, res, next) {
	var l1 = req.query.language1;
	var l2 = req.query.language2;
	var phrase = req.query.phrase;

	if (languages.indexOf(l1)== -1 || languages.indexOf(l2)== -1) {
		res.status(404).end();
	}
	console.log(l1,l2,phrase)
	return d.search(l1 + '-' + l2, phrase,function (err, data) {
		if (err) console.error(err);
		// console.log(data.results[0]);
		d.entry(l1 + '-' + l2, data.results[0]['entryId'], 'xml', function (err, entries) {
			if (err) console.error(err);
			console.log(entries);			
			parseString(entries.entryContent, function (err, result) {
				console.log(result);
    			res.send(result);
			});
			//res.send(entries);
			//res.json(entries.entryContent.toString());
		})
	});
});
