app.factory('QuizEntryFactory', function ($http){
	return {
		mute: function (id) {
			return $http.put('/api/quizentries/' + id + '/mute')
			.then (function (response){
				return response.data;
			});
		},

		saveModifiedEntries: function (arrQuizEntries) {
			console.log('Saving ' + arrQuizEntries.length + ' quizentries:');
			arrQuizEntries.forEach(function (qe) {
				console.log(qe);
				return $http.put('/api/quizentries/' + qe._id, qe)
				.then (function (response){
					return response.data;
				});
			})
		} 
	};
});