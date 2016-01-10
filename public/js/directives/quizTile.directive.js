app.directive('quizTile', function (QuizFactory) {
	return {
		restrict: 'E',
		templateUrl: 'templates/quizTile.html',
		scope: {
			quiz: '='
		}, 
		link: function(scope) {
			//use ng-click in quiz-tile to trigger:
			scope.onClick = function(currentQuiz) {
				console.log("must load quiz entries and then render quiz page:");
				console.log(currentQuiz);
				console.log(scope);
			}
			scope.dateUnused = new Date(1000);
		}
	}
});