app.directive('quizTile', function () {
	return {
		restrict: 'E',
		templateUrl: 'templates/quizTile.html',
		scope: {
			quiz: '='
		}, 
		link: function(scope) {
			scope.dateUnused = new Date(1000);	//use to evaluate whether a quiz has been used before
		}
	};
});