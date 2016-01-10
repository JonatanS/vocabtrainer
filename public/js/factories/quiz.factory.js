app.factory("QuizFactory", function ($http){
	return {
		//TODO: remove all of this: !!!!!!!!!!!!!!!!
		correct: 0,
		incorrect: 0,
		numQuestionsAsked: 0,
		numQuestionsSkipped: 0,
		getPercentSuccess : function(){
			return numQuestionsAsked > 0 ? correct/ numQuestionsAsked : 0;
		},
		// up to here !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		create: function (data) {
			return $http.post('/api/quizzes/', data)
			.then (function (response) {
				var quiz = response.data;
				return quiz;
			});
		},

		remove: function (id) {
			return $http.delete('/api/quizzes/' + id)
			.then (function (response) {
				return true;
			});
		},

		update: function (quiz) {
			console.log("factory:");
			console.log(quiz);
			quiz.dateLastTested = Date.now();
			return $http.put('/api/quizzes/' + quiz._id, {quiz: quiz})
			.then (function (response){
				return response.data;
			});
		},

		// getByUser: function (userId) {
		// 	return $http.get('/api/user/:userId/quizzes')
		// 	.then (function (response) {
		// 		return response.data;
		// 	});
		// },

		populateQuiz: function (id) {
			return $http.get('/api/quizzes/' +id)
			.then(function (response) {
				//should be populated with quizentries here.
				console.log("got quiz with quizEntries");
				console.log(response.data.entries);
				return response.data;
			});
		}
	};
});