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
				return DictionaryFactory.populateDict($stateParams.dictionaryId);
			}
		}
	});

	$stateProvider.state('practiceDictionary', {
		url: '/dictionaries/:dictionaryId/practice',
		templateUrl: '/templates/practiceDictionary.html',		
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
});