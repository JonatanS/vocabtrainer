app.directive('quizTile', function (QuizFactory) {
	return {
		restrict: 'E',
		templateUrl: 'templates/quizTile.html',
		scope: {
			quiz: '='
		},
		link: function (scope) {
			//all functions accessible in the scope
			scope.onClick = function (id) {
				//prepare quiz from factory
				console.log('loading quiz');
				return QuizFactory.getById(id)
				.then(function (selectedQuiz) {
					scope.currentQuiz = selectedQuiz;
				});

			},

			scope.updateQuiz = function () {
				//update quizEntries based on filters
				console.log("must update quiz");
			}


		}

	}
});