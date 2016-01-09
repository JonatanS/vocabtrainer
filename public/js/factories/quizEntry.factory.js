app.factory('QuizEntryFactory', function ($http){
	return {
		mute: function (id) {
			return $http.put('/api/quizentries/' + id + '/mute')
			.then (function (response){
				return response.data;
			});
		}
	};
});