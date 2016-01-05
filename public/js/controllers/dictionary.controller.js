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
			$scope.idx = ($scope.idx < $scope.entriesToQuiz.length - 1 ? $scope.idx+1 : 0);
		}
		$scope.currentPhrase = $scope.entriesToQuiz[$scope.idx];
		$scope.hint.show = false;
		console.log($scope.currentPhrase);
		QuizFactory.numQuestionsAsked++;
	};

	$scope.evaluateSubmission = function(){
		if($scope.submission.answer === $scope.currentPhrase.phraseL1) {
			QuizFactory.correct ++;
			showAlert(true);
		}
		else {
			QuizFactory.incorrect ++;
			showAlert(false);
		}
		$scope.submission.answer = null;
		$scope.setPhraseToQuiz($scope.randomMode);
	};

	$scope.skipQuestion = function(){
		$scope.submission.answer = null;
		QuizFactory.incorrect ++;
		QuizFactory.numQuestionsSkipped ++;
		$scope.setPhraseToQuiz($scope.randomMode);
	};

	$scope.showHint = function(hintType) {
		//numLetters
		if (hintType === "numLetters") {
			$scope.hint.value = $scope.currentPhrase.phraseL1.length;
		}
		//numWords
		else if (hintType === "numWords") {
			$scope.hint.value = $scope.currentPhrase.phraseL1.split(" ").length;
		}
		//firstLetter
		else if (hintType === "firstLetter") {
			$scope.hint.value = $scope.currentPhrase.category === "noun" ? $scope.currentPhrase.phraseL1.split(" ")[1][0] : $scope.currentPhrase.phraseL1[0];
		}

		//gender (for nouns)
		else if (hintType === "gender") {
			$scope.hint.value = $scope.currentPhrase.phraseL1.split(" ")[0];
		}
		//vowels
		else if (hintType === "vowels") {
			//regex replace filter "_"
			$scope.hint.value = $scope.currentPhrase.phraseL1.replace(/[^aeiou!%&@?,.';:"\s]/g, '_');
		}
		//solution
		else if (hintType === "solution") {
			$scope.hint.value = $scope.currentPhrase.phraseL1
		}

		else if (hintType === "example") {
			return LookupFactory.getGlosbePhrases($scope.currentPhrase.phraseL1, $scope.activeDictionary.language1, $scope.activeDictionary.language2)
			.then( function (response) {
				console.log(response);
				$scope.example.value = response.examples[0].first;
			})
		}
		$scope.hint.type = hintType;
		$scope.hint.show = true;

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
		$timeout(function() {
		    $scope.alert.show = false;
		}, 3000);

	}

	$scope.randomMode = false;
	$scope.alert = {
		show : false,
		success : false,
		failure : false
	};
	$scope.hint = {
		show : false,
		value: ""
	};
	$scope.submission = {
		answer: null
	};
	$scope.example = {
		value: "",
		show. false
	}
	$scope.setEntriesToQuiz({});
	$scope.setPhraseToQuiz(false);

});