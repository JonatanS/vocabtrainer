//angular-app.js

var app = angular.module('vocabularyTrainer', ['ui.router']);

app.config(function ($stateProvider){
	$stateProvider.state('user', {
		url: '/user',
		templateUrl: '/templates/user.html',
		//activeTab: 'cards'
		//template: '<h1>HELLO ALL</h1>'
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

	$stateProvider.state('practiceDictionaryOld', {
		url: '/dictionaries/:dictionaryId/practice',
		templateUrl: '/templates/practiceDictionaryOld.html',		
		controller: 'DictionaryCtrl',
		resolve: {
			activeDictionary: function (DictionaryFactory, $stateParams) {
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
			activeQuiz: function (QuizFactory, $stateParams) {
				return QuizFactory.populateQuiz($stateParams.quizId);
			},
			activeDictionary: function($stateParams) {
				return $stateParams.dict;
			}
		}
	});
});