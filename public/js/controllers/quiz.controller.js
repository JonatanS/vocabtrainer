app.controller("QuizController", function ($scope, QuizFactory){
	console.log(QuizFactory);
	$scope.scores = QuizFactory;
});