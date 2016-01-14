app.factory("CollinsFactory", function ($http) {
	this._ = _;
	return {
		getPhrases: function (language1, language2, phrase) {
			//	return $http.put('/api/entries/' + entry._id, {entry: entry})
			return $http.get('/api/lookup/dictionaries/search?language1=' + language1 + '&language2='+language2+'&phrase='+phrase)
			.then( function (response) {
				console.dir(response.data);
				var unfilteredObj = response.data.entry;
				//get several phrase info {}:
				var phraseInfos = unfilteredObj.form.map(function (entry) {
					return {	
						expression:  entry.orth[0],
						pronounciation: processPronResponse(entry.pron).pronounciation,
						audio: processPronResponse(entry.pron).audioUrl
					};
				});

				var examples = [];
				var retObj = {
					phraseInfos: phraseInfos,
					examples: examples
				}
				return retObj;
			});
		}

	};
});

var processPronResponse = function(pronArr) {
	//check whether properties exist and return an object:
	var retObj = {
		pronounciation: "",
		audioUrl: "" 
	};
	if(!pronArr) return retObj;
	//use lodash get method to get nested properties:
	retObj.pronounciation = this._.get(pronArr[0], '_', null);
	retObj.audioUrl = this._.get(pronArr[0], "audio[0].source[0]['$']", null);
	return retObj;
}