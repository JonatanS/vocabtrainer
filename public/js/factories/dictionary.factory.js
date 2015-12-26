app.factory("DictionaryFactory", function ($http){

	return {
		getEntries : function (dictId) {
			return $http.get('/api/dictionaries/' + dictId)
			.then( function (response) {
				var dictionary = response.data;
				return dictionary;
			});
		}
		// ,

		// getEntriesFiltered : function (dictId, data) {
		// 	return $http.get('/api/dictionaries/' + dictId, data)
		// 	.then( function (response) {
		// 		var dictionary = response.data;
		// 		return dictionary;
		// 	});
		// }
	};
});