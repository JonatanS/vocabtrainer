app.controller("QuizController", function ($scope, ScoreFactory){
	console.log(ScoreFactory);
	$scope.scores = ScoreFactory;
});