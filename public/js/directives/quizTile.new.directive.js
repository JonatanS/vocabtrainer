app.directive('quizTileNew', function () {
	return {
		restrict: 'E',
		templateUrl: 'templates/quizTileNew.html',
		scope: {
			newQuiz: '='
		},
		link: function (scope) {
			scope.clickInsideTile = function(quiz) {
				console.log("in new Tile Directive");
				console.log(quiz);
			};

			scope.clickInsideTileH2 = function(quiz) {
				console.log("clicked on H2!");
			};
		}
	}
});