app.factory('LookupFactory', function ($http, $q) {
	return {
		getGlosbePhrases: function (phrase, sourceLanguage, targetLanguage) {
            //create promise using q:
            //http://stackoverflow.com/questions/28209744/angularjs-ionic-typeerror-cannot-read-property-then-of-undefined
            var deferred = $q.defer();

			//var url = "https://glosbe.com/gapi/translate?from=deu&dest=eng&phrase=Katze&format=json&tm=false&callback=JSON_CALLBACK";
			var url = "https://glosbe.com/gapi/translate?from=" + getLanguageCode(sourceLanguage) + "&dest=" + getLanguageCode(targetLanguage) + "&phrase=" + phrase + "&format=json&tm=true&callback=JSON_CALLBACK";
			console.log(url);
			$http.jsonp(url)
			.success(function (response) {
				deferred.resolve(response);
			}) 
			.error( function (err) {
				console.error(err);
				deferred.reject(err);
			});
			return deferred.promise;
		}
	};

	function getLanguageCode(language) {
		if (language.toLowerCase() === "german") return 'deu';
		if (language.toLowerCase() === "english") return 'eng';
		if (language.toLowerCase() === "french") return 'fra';
		if (language.toLowerCase() === "italian") return 'ita';
		if (language.toLowerCase() === "spanish") return 'spa';
	};
});