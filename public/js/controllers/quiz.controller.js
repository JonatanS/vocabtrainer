//app.controller("QuizCtrl", function ($scope, QuizFactory, activeQuiz, activeDictionary ){
app.controller("QuizCtrl", function ($scope, QuizFactory, quizData, $timeout, LookupFactory, QuizEntryFactory ){
	console.log(quizData);
	$scope.activeQuiz = quizData.quiz;
	$scope.activeDictionary = quizData.dictionary;

	//before every round:
	$scope.prepareNextRound = function() {
		console.log($scope.activeQuiz);		
		$scope.hint.show = false;
		$scope.example.show = false;
		$scope.submission.answer = null;
		$scope.setPhraseToQuiz();
		resetScore();
	};

	//randomly pick a phrase to translate:
	$scope.setPhraseToQuiz = function() {
		if(!$scope.idx && $scope.idx!==0) $scope.idx = -1;
		if($scope.randomMode) {
			$scope.idx = Math.floor((Math.random() * $scope.activeQuiz.entries.length - 1) + 1);
		}
		else {
			$scope.idx = ($scope.idx < $scope.activeQuiz.entries.length - 1 ? $scope.idx+1 : 0);
		}
		$scope.currentPhrase = $scope.activeQuiz.entries[$scope.idx].entry;
		QuizFactory.numQuestionsAsked++;
		console.log($scope.currentPhrase);
	};

	$scope.evaluateSubmission = function(){
		if($scope.submission.answer === $scope.currentPhrase.phraseL1) {
			//calculate added points. 

			//prepare next round as callback
			showAlert(true);
		}
		else {
			showAlert(false);
		}
		//save Quiz and QuizEntry
		saveProgress();
	};

	$scope.skipQuestion = function(){
		deductLive();
		saveProgress();
		$scope.prepareNextRound();
	};

	$scope.showHint = function(hintType) {
		//numLetters
		if (hintType === "numLetters") {
			$scope.hint.value = $scope.currentPhrase.phraseL1.length;
			++$scope.score.penalty;
		}
		//numWords
		else if (hintType === "numWords") {
			$scope.hint.value = $scope.currentPhrase.phraseL1.split(" ").length;
			++$scope.score.penalty;
		}
		//firstLetter
		else if (hintType === "firstLetter") {
			$scope.hint.value = $scope.currentPhrase.category === "noun" ? $scope.currentPhrase.phraseL1.split(" ")[1][0] : $scope.currentPhrase.phraseL1[0];
			++$scope.score.penalty;
		}

		//gender (for nouns)
		else if (hintType === "gender") {
			$scope.hint.value = $scope.currentPhrase.phraseL1.split(" ")[0];
			++$scope.score.penalty;
		}
		//vowels
		else if (hintType === "vowels") {
			//regex replace filter "_"
			$scope.hint.value = $scope.currentPhrase.phraseL1.replace(/[^aeiou!%&@?,.';:"\s]/g, '_');
			$scope.score.penalty = $scope.score.penalty +2;
		}
		//solution
		else if (hintType === "solution") {
			$scope.hint.value = $scope.currentPhrase.phraseL1
			$scope.score.penalty = 5;
		}
		$scope.hint.type = hintType;
		$scope.hint.show = true;
	};

	$scope.toggleRandom = function () {
		$scope.randomMode = ! $scope.randomMode;
		console.log($scope.randomMode);
		if($scope.randomMode) $("#randomModeBtn").addClass("active");
		else $("#randomModeBtn").removeClass("active");
	};

	$scope.dislikeEntry = function() {
		//set mute of entry to true and save
		QuizEntryFactory.mute($scope.activeQuiz.entries[$scope.idx]._id);
		$scope.activeQuiz.entries.splice($scope.idx, 1);
		$scope.prepareNextRound();
	};

	$scope.getExamples = function () {
		$scope.example.show = true;
		if ($scope.example.examples.length === 0 && $scope.example.idx === -1) {
			//grab examples from API and populate .examples array:
			return LookupFactory.getGlosbePhrases($scope.currentPhrase.phraseL1,$scope.activeDictionary.language1, $scope.activeDictionary.language2)
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

	var deductLive = function() {
		--$scope.activeQuiz.livesRemaining;

		if($scope.activeQuiz.livesRemaining === 0) {
			alert("Game Over. No more lives left");
			//save quiz and quiz entries
			//show a modal with final score and button to select next quiz
		}
	}

	var saveProgress = function(){
		++$scope.activeQuiz.numSubmits;
		//calculate score for this submit:


		//calculate current score for this quiz:

		// //calculate new average:
		// $scope.activeQuiz.avgScore = $scope.activeQuiz.avgScore * ($scope.activeQuiz.numSubmits-1) + 

	};

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

	var resetScore = function() {
		$scope.score.penalty = 0;	//reset to 0
		$scope.score.phraseValue = $scope.currentPhrase.level * 5 * ($scope.currentPhrase.type == 'word' ? 1 : 2);	//make dependent on level/ multiple words (5* level)
		if(!$scope.score.phraseValue) $scope.score.phraseValue = 5;
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

	$scope.score = {
		penalty: 0,
		phraseValue: 0,	//make dependent on level/ multiple words (5* level)
		totalPoints: $scope.activeQuiz.currentScore
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
	$scope.example = {
		value: "",
		show: false,
		examples: [],
		idx: -1
	};
	$scope.submission = {
		answer: null
	};
	$scope.prepareNextRound();
});