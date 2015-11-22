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
	//res.send("in dict list view");
	//look up dict 
	var promiseArr = []
	return Dict.findById({_id: req.params.dictId})
	.then(function(dict){
		console.log("Dict:" + dict);
    	//res.send(entries);
    	res.render('entriesListView', {dictionary: dict});
	});
});
