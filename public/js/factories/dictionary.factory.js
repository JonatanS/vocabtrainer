app.factory("DictionaryFactory", function ($http){

	return {
		populateDict : function (dictId) {
			//grab entries and quizzes
			return $http.get('/api/dictionaries/' + dictId)
			.then( function (response) {
				var dictionary = response.data;
				return dictionary;
			});
		},

		remove: function (id) {
			console.log(id);
			return $http.delete('/api/dictionaries/' + id)
			.then (function (response) {
				return true;
			});
		},
	};
});