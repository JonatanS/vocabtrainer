app.controller("DictionaryCtrl", function ($scope, $timeout, activeDictionary, EntryFactory, QuizFactory, LookupFactory) {
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


	// //////////////////////////////////////////////////////////////////
	// //QUIZ METHODS:
	// //////////////////////////////////////////////////////////////////

	// //randomly pick a phrase to translate:
	// $scope.setPhraseToQuiz = function(random) {
	// 	if(!$scope.idx && $scope.idx!==0) $scope.idx = -1;
	// 	if(random) {
	// 		$scope.idx = Math.floor((Math.random() * $scope.entriesToQuiz.length - 1) + 1);
	// 	}
	// 	else {
	// 		$scope.idx = ($scope.idx < $scope.entriesToQuiz.length - 1 ? $scope.idx+1 : 0);
	// 	}
	// 	$scope.currentPhrase = $scope.entriesToQuiz[$scope.idx];
	// 	$scope.hint.show = false;
	// 	console.log($scope.currentPhrase);
	// 	QuizFactory.numQuestionsAsked++;
	// };

	// $scope.evaluateSubmission = function(){
	// 	if($scope.submission.answer === $scope.currentPhrase.phraseL1) {
	// 		QuizFactory.correct ++;
	// 		showAlert(true);
	// 	}
	// 	else {
	// 		QuizFactory.incorrect ++;
	// 		showAlert(false);
	// 	}
	// 	$scope.submission.answer = null;
	// 	$scope.setPhraseToQuiz($scope.randomMode);
	// };

	// $scope.skipQuestion = function(){
	// 	$scope.submission.answer = null;
	// 	QuizFactory.incorrect ++;
	// 	QuizFactory.numQuestionsSkipped ++;
	// 	$scope.setPhraseToQuiz($scope.randomMode);
	// };

	// $scope.showHint = function(hintType) {
	// 	//numLetters
	// 	if (hintType === "numLetters") {
	// 		$scope.hint.value = $scope.currentPhrase.phraseL1.length;
	// 	}
	// 	//numWords
	// 	else if (hintType === "numWords") {
	// 		$scope.hint.value = $scope.currentPhrase.phraseL1.split(" ").length;
	// 	}
	// 	//firstLetter
	// 	else if (hintType === "firstLetter") {
	// 		$scope.hint.value = $scope.currentPhrase.category === "noun" ? $scope.currentPhrase.phraseL1.split(" ")[1][0] : $scope.currentPhrase.phraseL1[0];
	// 	}

	// 	//gender (for nouns)
	// 	else if (hintType === "gender") {
	// 		$scope.hint.value = $scope.currentPhrase.phraseL1.split(" ")[0];
	// 	}
	// 	//vowels
	// 	else if (hintType === "vowels") {
	// 		//regex replace filter "_"
	// 		$scope.hint.value = $scope.currentPhrase.phraseL1.replace(/[^aeiou!%&@?,.';:"\s]/g, '_');
	// 	}
	// 	//solution
	// 	else if (hintType === "solution") {
	// 		$scope.hint.value = $scope.currentPhrase.phraseL1
	// 	}
	// 	$scope.hint.type = hintType;
	// 	$scope.hint.show = true;

	// };

	// $scope.setEntriesToQuiz = function(selectionCriteria) {
	// 	//TODO: filter selection based on criteria. for now take entire dict:
	// 	$scope.entriesToQuiz = angular.copy($scope.activeDictionary.entries);
	// };

	// $scope.toggleRandom = function () {
	// 	$scope.randomMode = ! $scope.randomMode;
	// 	console.log($scope.randomMode);
	// 	if($scope.randomMode) $("#randomModeBtn").addClass("active");
	// 	else $("#randomModeBtn").removeClass("active");
	// };

	// $scope.getExamples = function () {
	// 	$scope.example.show = true;
	// 	if ($scope.example.examples.length === 0 && $scope.example.idx === -1) {
	// 		//grab examples from API and populate .examples array:
	// 		return LookupFactory.getGlosbePhrases($scope.currentPhrase.phraseL1,$scope.activeDictionary.language1, $scope.activeDictionary.language2)
	// 		.then( function (response) {
	// 			$scope.example.examples = response.examples.map(function (e) {
	// 				console.log(e.first.replace(/<.*?>/g,''));
	// 				return e.first.replace(/<.*?>/g,'');
	// 			});
	// 			selectExample();
	// 		});
	// 	}
	// 	else selectExample();	

	// };


	// $scope.testQuizData = function() {
	// 	console.log(activeDictionary);
	// }





	// var selectExample = function () {
	// 		console.log($scope.example);
	// 		if ($scope.example.examples.length > 0) {
	// 			console.log("incr idx");
	// 			$scope.example.idx = $scope.example.idx < $scope.example.examples.length -1 ? $scope.example.idx+=1 : 0;
	// 			console.log($scope.example.idx);
	// 			$scope.example.value = $scope.example.examples[$scope.example.idx];
	// 		}
	// 		else $scope.example.value = "No examples available for this phrase";
	// 		console.log($scope.example.value);
	// };

	// var showAlert = function (success) {
	// 	if (success) {
	// 		$scope.alert.failure = false;
	// 		$scope.alert.success = true;
	// 	}
	// 	else {
	// 		$scope.alert.failure = true;
	// 		$scope.alert.success = false;
	// 	}
	// 	$scope.alert.show = true;
	// 	$timeout(function() {
	// 	    $scope.alert.show = false;
	// 	}, 3000);
	// };


	// $scope.randomMode = false;
	// $scope.alert = {
	// 	show : false,
	// 	success : false,
	// 	failure : false
	// };
	// $scope.hint = {
	// 	show : false,
	// 	value: ""
	// };
	// $scope.example = {
	// 	value: "",
	// 	show: false,
	// 	examples: [],
	// 	idx: -1
	// };
	// $scope.submission = {
	// 	answer: null
	// };
	// $scope.setEntriesToQuiz({});
	// $scope.setPhraseToQuiz(false);
});
