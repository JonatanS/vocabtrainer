//angular-app.js

var app = angular.module('vocabularyTrainer', ['ui.router']);

app.config(function ($stateProvider){
	$stateProvider.state('user', {
		url: '/user',
		templateUrl: '/templates/user.html',
		//activeTab: 'cards'
		//template: '<h1>HELLO ALL</h1>'
	});

	$stateProvider.state('dictionary', {
		url: '/dictionaries/:dictionaryId',
		templateUrl: '/templates/dictionary.html',		
		controller: 'DictionaryCtrl',
		resolve: {
			activeDictionary: function (DictionaryFactory, $stateParams) {
				return DictionaryFactory.getEntries($stateParams.dictionaryId);
			}
		}
	});

	// $stateProvider.state('entryForm', {
	// 	url: '/entries/new',
	// 	templateUrl: '/templates/entryForm.html',
	// 	controller: 'EntryFormCtrl'
	// });
});