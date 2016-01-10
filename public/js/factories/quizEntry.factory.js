app.factory('QuizEntryFactory', function ($http){
	return {
		mute: function (id) {
			return $http.put('/api/quizentries/' + id + '/mute')
			.then (function (response){
				return response.data;
			});
		},

		saveModifiedEntries: function (arrQuizEntries) {
			arrQuizEntries.forEach(function (qe) {
				return $http.put('/api/quizentries/' + qe._id, qe)
				.then (function (response){
					return response.data;
				});
			})
		} 
	};
});