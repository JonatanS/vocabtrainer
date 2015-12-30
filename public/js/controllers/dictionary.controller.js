app.controller("DictionaryCtrl", function ($scope, $timeout, activeDictionary, EntryFactory, ScoreFactory) {
	$scope.activeDictionary = activeDictionary;

	//////////////////////////////////////////////////////////////////
	//EDIT DICT METHODS:
	//////////////////////////////////////////////////////////////////

	$scope.newEntry = {
		//set user and dict variables
		userId : activeDictionary.user,
		dict : activeDictionary
	};

	$scope.createEntry = function () {
		console.log("DictCtrl" + $scope);
		console.dir(activeDictionary);
		return EntryFactory.create($scope.newEntry)
		.then(function (addedEntry){
			$scope.activeDictionary.entries.push(addedEntry);
			$scope.newEntry = {
				userId : activeDictionary.user,
				dict : activeDictionary
			};
			return addedEntry;
		});
	};

	//this function is triggered by the isolated Entry scope
	$scope.removeEntry = function () {
		var entryToRemove = this.theEntry;
		EntryFactory.remove(entryToRemove._id)
			.then (function () {
				//remove entry from activDict:
				pos = $scope.activeDictionary.entries.map(function(e) { return e._id; }).indexOf(entryToRemove._id);
				if (pos !== -1) $scope.activeDictionary.entries.splice(pos,1);
			});
	};


	//////////////////////////////////////////////////////////////////
	//QUIZ METHODS:
	//////////////////////////////////////////////////////////////////

	//randomly pick a phrase to translate:
	$scope.setPhraseToQuiz = function(random) {
		if(!$scope.idx && $scope.idx!==0) $scope.idx = -1;
		if(random) {
			$scope.idx = Math.floor((Math.random() * $scope.entriesToQuiz.length - 1) + 1);
		}
		else {
			$scope.idx = ($scope.idx < $scope.entriesToQuiz.length - 2 ? $scope.idx+1 : 0);
		}
		$scope.currentPhrase = $scope.entriesToQuiz[$scope.idx];
		ScoreFactory.numQuestionsAsked++;
	};

	$scope.evaluateSubmission = function(){
		if($scope.submission.answer === $scope.currentPhrase.phraseL1) {
			ScoreFactory.correct ++;
			showAlert(true);
		}
		else {
			ScoreFactory.incorrect ++;
			showAlert(false);
		}
		$scope.submission.answer = null;
		$scope.setPhraseToQuiz($scope.randomMode);
	};

	$scope.skipQuestion = function(){
		$scope.submission.answer = null;
		ScoreFactory.incorrect ++;
		ScoreFactory.numQuestionsSkipped ++;
		$scope.setPhraseToQuiz($scope.randomMode);
	};

	$scope.setEntriesToQuiz = function(selectionCriteria) {
		//TODO: filter selection based on criteria. for now take entire dict:
		$scope.entriesToQuiz = angular.copy($scope.activeDictionary.entries);
	};

	$scope.toggleRandom = function () {
		$scope.randomMode = ! $scope.randomMode;
		console.log($scope.randomMode);
		if($scope.randomMode) $("#randomModeBtn").addClass("active");
		else $("#randomModeBtn").removeClass("active");
	};

	var showAlert = function (success) {
		if (success) {
			$scope.alert.failure = false;
			$scope.alert.success = true;
		}
		else {
			$scope.alert.failure = true;
			$scope.alert.success = false;
		}
		$scope.alert.show = true;
		//display alert for 1 sec:
		$timeout(function() {
		    $scope.alert.show = false;
		}, 1000);

	}

	$scope.setEntriesToQuiz({});
	$scope.setPhraseToQuiz(false);
	$scope.randomMode = false;
	$scope.alert = {
		show : false,
		success : false,
		failure : false
	};

});