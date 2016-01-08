app.controller("QuizController", function ($scope, QuizFactory){
	console.log(QuizFactory);
	$scope.scores = QuizFactory;	//TODO: Replace this?


	// //loadQuizzes
	// $scope.getQuizzes = function() {
	// 	return QuizFactory.getAll()
	// 	.then (function (allQuizzes) {
	// 		$scope.allQuizzes = allQuizzes;
	// 	})
	// };

	// $scope.getQuizzes();	//populate $scope.allQuizzes
});