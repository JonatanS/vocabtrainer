//angular-app.js

var app = angular.module('vocabularyTrainer', ['ui.router']);

app.config(function ($stateProvider){
	$stateProvider.state('user', {
		url: '/user',
		templateUrl: '/templates/user.html',
	});

	$stateProvider.state('editDictionary', {
		url: '/dictionaries/:dictionaryId/edit',
		templateUrl: '/templates/editDictionary.html',		
		controller: 'DictionaryCtrl',
		resolve: {
			activeDictionary: function (DictionaryFactory, $stateParams) {
				console.log($stateParams);
				return DictionaryFactory.populateDict($stateParams.dictionaryId);
			}
		}
	});

	$stateProvider.state('getQuizzes', {
		url: '/dictionaries/:dictionaryId/quizzes',
		templateUrl: '/templates/quizSelector.html',
		controller: 'DictionaryCtrl',
		resolve: {
			activeDictionary: function (DictionaryFactory, $stateParams) {
				return DictionaryFactory.populateDict($stateParams.dictionaryId);
			}
		}
	});


	$stateProvider.state('takeQuiz', {
		url: '/quizzes/:quizId/take',
		templateUrl: '/templates/takeQuiz.html',		
		controller: 'QuizCtrl',
		resolve: {

			//$stateParams are contained in the URL!!!
			quizData: function (QuizFactory, DictionaryFactory, $stateParams) {
				var retObject = {};
				return QuizFactory.populateQuiz($stateParams.quizId)
				.then(function (quiz){
					console.log("getting dictionary for quiz page");
					retObject.quiz = quiz;
					return DictionaryFactory.populateDict(quiz.dictionary);				
				})
				.then(function (activeDictionary) {
					retObject.dictionary = activeDictionary;
					return retObject;
				});
			}
		}
	});
});