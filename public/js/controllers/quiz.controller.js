app.controller("QuizCtrl", function ($scope, QuizFactory, activeQuiz, activeDictionary ){
	$scope.activeQuiz = activeQuiz;
	$scope.activeDictionary = activeDictionary;
	$scope.scores = QuizFactory;	//TODO: Replace this?
	//console.log("ACTIVE:", activeQuiz);

	//////////////////////////////////////////////////////////////////
	//QUIZ METHODS:
	//////////////////////////////////////////////////////////////////

	//randomly pick a phrase to translate:
	$scope.setPhraseToQuiz = function(random) {
		if(!$scope.idx && $scope.idx!==0) $scope.idx = -1;
		if(random) {
			$scope.idx = Math.floor((Math.random() * $scope.activeQuiz.entries.length - 1) + 1);
		}
		else {
			$scope.idx = ($scope.idx < $scope.activeQuiz.entries.length - 1 ? $scope.idx+1 : 0);
		}
		$scope.currentPhrase = $scope.activeQuiz.entries[$scope.idx];
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
		$scope.hint.type = hintType;
		$scope.hint.show = true;

	};

	// $scope.setEntriesToQuiz = function(selectionCriteria) {
	// 	//TODO: filter selection based on criteria. for now take entire dict:
	// 	console.log($scope);
	// 	$scope.activeQuiz.entries = angular.copy($scope.activeQuiz.entries);
	// };

	$scope.toggleRandom = function () {
		$scope.randomMode = ! $scope.randomMode;
		console.log($scope.randomMode);
		if($scope.randomMode) $("#randomModeBtn").addClass("active");
		else $("#randomModeBtn").removeClass("active");
	};

	$scope.getExamples = function () {
		$scope.example.show = true;
		if ($scope.example.examples.length === 0 && $scope.example.idx === -1) {
			//grab examples from API and populate .examples array:
			return LookupFactory.getGlosbePhrases($scope.currentPhrase.phraseL1,$scope.activeQuiz.language1, $scope.activeQuiz.language2)
			.then( function (response) {
				$scope.example.examples = response.examples.map(function (e) {
					console.log(e.first.replace(/<.*?>/g,''));
					return e.first.replace(/<.*?>/g,'');
				});
				selectExample();
			});
		}
		else selectExample();	

	};


	$scope.testQuizData = function() {
		console.log(activeQuiz);
	}


	var selectExample = function () {
			console.log($scope.example);
			if ($scope.example.examples.length > 0) {
				console.log("incr idx");
				$scope.example.idx = $scope.example.idx < $scope.example.examples.length -1 ? $scope.example.idx+=1 : 0;
				console.log($scope.example.idx);
				$scope.example.value = $scope.example.examples[$scope.example.idx];
			}
			else $scope.example.value = "No examples available for this phrase";
			console.log($scope.example.value);
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
	};


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
	$scope.example = {
		value: "",
		show: false,
		examples: [],
		idx: -1
	};
	$scope.submission = {
		answer: null
	};
	//$scope.setEntriesToQuiz({});
	$scope.setPhraseToQuiz(false);
});