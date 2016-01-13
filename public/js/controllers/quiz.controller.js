//app.controller("QuizCtrl", function ($scope, QuizFactory, activeQuiz, activeDictionary ){
app.controller("QuizCtrl", function ($location, $scope, QuizFactory, quizData, $timeout, LookupFactory, CollinsFactory, QuizEntryFactory ){
	console.log(quizData);
	$scope.activeQuiz = quizData.quiz;
	$scope.activeDictionary = quizData.dictionary;


	$scope.hideAlert = function () {
		$scope.impatientClick = true;
		prepareNextRound(true);
	}

	$scope.evaluateSubmission = function(){

		if($scope.submission.answer === $scope.currentPhrase.phraseL1) {
			//set score
		}
		else {
			$scope.score.penalty = 4;
		}
		//save Quiz and QuizEntry
		updateProgress();
		$scope.showHint('solution');
		//send prepare next round as callback
		showAlert(prepareNextRound);
	};

	$scope.skipQuestion = function(){
		deductLive();
		updateProgress();
		prepareNextRound();
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
			$scope.hint.value = $scope.currentPhrase.phraseL1.replace(/[^aeiou!%&@?,.';:"\s]/gi, '_');
			$scope.score.penalty = $scope.score.penalty +2;
		}
		//solution
		else if (hintType === "solution") {
			$scope.hint.value = $scope.currentPhrase.phraseL1
			$scope.score.penalty = 4;
		}
		$scope.score.penalty = ($scope.score.penalty > 4 ? 4 : $scope.score.penalty);
		$scope.hint.type = hintType;
		$scope.hint.show = true;
	};

	$scope.toggleRandom = function () {
		$scope.randomMode = ! $scope.randomMode;
		if($scope.randomMode) $("#randomModeBtn").addClass("active");
		else $("#randomModeBtn").removeClass("active");
	};

	$scope.dislikeEntry = function() {
		//set mute of entry to true and save
		QuizEntryFactory.mute($scope.activeQuiz.entries[$scope.idx]._id);
		$scope.activeQuiz.entries.splice($scope.idx, 1);
		prepareNextRound();
	};

	$scope.getExamplesGlosbe = function () {
		$scope.example.show = true;
		if ($scope.example.examples.length === 0 && $scope.example.idx === -1) {
			//grab examples from API and populate .examples array:
			return LookupFactory.getGlosbePhrases($scope.currentPhrase.phraseL1,$scope.activeDictionary.language1, $scope.activeDictionary.language2)
			.then( function (response) {
				$scope.example.examples = response.examples.map(function (e) {
					return e.first.replace(/<.*?>/g,'');
				});
				selectExample();
			});
		}
		else selectExample();	
	};

	$scope.getExamples = function () {
		$scope.example.show = true;
		if ($scope.example.examples.length === 0 && $scope.example.idx === -1) {
			//grab examples from API and populate .examples array:
			return CollinsFactory.getPhrases($scope.currentPhrase.phraseL1)
			.then( function (response) {
				$scope.example.examples = response.examples.map(function (e) {
					return e.first.replace(/<.*?>/g,'');
				});
				selectExample();
			});
		}
		else selectExample();	
	};

	$scope.pauseQuiz = function() {
		var path = '/dictionaries/'+ $scope.activeDictionary._id + '/quizzes';
		$location.path(path);
	};
	
	$scope.resetQuiz = function() {
		alert("reset quiz");
	};

	var numStepsSinceLastSave = 0;
	var arrModifiedEntries = [];
	var nextScoreToReach = $scope.activeQuiz.currentScore + 50;
	

	//before every round:
	var prepareNextRound = function(impatient) {	
		var hiddenAlert = impatient || false;

		if (hiddenAlert) {		
			$scope.hint.show = false;
			$scope.example.show = false;
			$scope.submission.answer = null;
			setPhraseToQuiz();
			resetScore();
		}
		if (!hiddenAlert && !$scope.impatientClick) {
			//this was not called from hideAlert()
			$scope.hint.show = false;
			$scope.example.show = false;
			$scope.submission.answer = null;
			setPhraseToQuiz();
			resetScore();
			$scope.impatientClick = false;
		}
		if (!hiddenAlert && $scope.impatientClick) {
			$scope.impatientClick = false;
		}
	};

	//randomly pick a phrase to translate:
	var setPhraseToQuiz = function() {
		if(!$scope.idx && $scope.idx!==0) $scope.idx = -1;
		if($scope.randomMode) {
			$scope.idx = Math.floor((Math.random() * $scope.activeQuiz.entries.length - 1) + 1);
		}
		else {
			$scope.idx = ($scope.idx < $scope.activeQuiz.entries.length - 1 ? $scope.idx+1 : 0);
		}
		$scope.currentPhrase = $scope.activeQuiz.entries[$scope.idx].entry;
	};

	var deductLive = function() {
		--$scope.activeQuiz.livesRemaining;

		if($scope.activeQuiz.livesRemaining === 0) {
			alert("Game Over. No more lives left");
			//evaluate best score when game is over
			if ($scope.activeQuiz.currentScore > $scope.activeQuiz.bestScore) {
				$scope.activeQuiz.bestScore = $scope.activeQuiz.currentScore;
				$scope.activeQuiz.dateBestScore = Date.now();
			}
			saveProgress();
		//TODO show a modal with final score and button to select next quiz
		}
	}

	var updateProgress = function(){
		//calculate score for this attempt:
		console.dir($scope.score);
		$scope.score.phraseScore = $scope.score.phraseValue - ($scope.score.penalty/4 * $scope.score.phraseMultiplier * 5);

		//calculate current score for this QUIZ:
		$scope.activeQuiz.currentScore += $scope.score.phraseScore;

		if ($scope.activeQuiz.currentScore >= nextScoreToReach) {
			alert("nice job - you reached 50 more points");
			nextScoreToReach = nextScoreToReach + 50;
			//TODO: Show modal here with giphy or animation
		}

		// //calculate new average:
		$scope.activeQuiz.avgScore = ($scope.activeQuiz.avgScore * $scope.activeQuiz.numAttempts + $scope.score.phraseScore)/($scope.activeQuiz.numAttempts +1);
		++$scope.activeQuiz.numAttempts;

		//update curQuizEntry
		var curQuizEntry = $scope.activeQuiz.entries[$scope.idx];
		curQuizEntry.dateLastTested = Date.now();

		$scope.feedback.trend = (curQuizEntry.lastScore < $scope.score.phraseScore ? 2 : curQuizEntry.lastScore === $scope.score.phraseScore? 1 : 0);
		$scope.feedback.type = ($scope.score.penalty === 0 ? 2 : $scope.score.penalty === 4 ? 0 : 1);
		if ($scope.score.penalty === 4) deductLive();
		curQuizEntry.lastScore = $scope.score.phraseScore;
		curQuizEntry.avgScore = (curQuizEntry.avgScore * curQuizEntry.numAttempts + $scope.score.phraseScore)/(curQuizEntry.numAttempts +1);
		++curQuizEntry.numAttempts;
		arrModifiedEntries.push(curQuizEntry);

		++numStepsSinceLastSave;
		//save at every step
		if (numStepsSinceLastSave > 0) {
			saveProgress();
			numStepsSinceLastSave = 0;
		}
	};

	var saveProgress = function() {
		console.log('saving');
		//save entries from arrModifiedEntries
		QuizEntryFactory.saveModifiedEntries(arrModifiedEntries);
		//save quiz
		QuizFactory.update($scope.activeQuiz);

		arrModifiedEntries = [];
		//alert: progress has been saved
	}

	var selectExample = function () {
			if ($scope.example.examples.length > 0) {
				$scope.example.idx = $scope.example.idx < $scope.example.examples.length -1 ? $scope.example.idx+=1 : 0;
				//console.log($scope.example.idx);
				$scope.example.value = $scope.example.examples[$scope.example.idx];
			}
			else $scope.example.value = "No examples available for this phrase";
	};

	var resetScore = function() {
		$scope.score.penalty = 0;	//reset to 1
		$scope.score.phraseMultiplier = $scope.currentPhrase.level * ($scope.currentPhrase.type == 'word' ? 1 : 2 || 1);	//make dependent on level/ multiple words (5* level)
		$scope.score.phraseValue = 5 * $scope.score.phraseMultiplier;
	};

	var showAlert = function (cb) {
		$scope.feedback.show = true;
		$timeout(function() {
		    $scope.feedback.show = false;
		    //console.log("In alert");
		    cb();
		}, 3000);
	};

	$scope.impatientClick = false;	//used to remove 3 second delay of alert

	$scope.score = {
		penalty: 0,
		phraseValue: 0,	//make dependent on level/ multiple words (5* level)
		phraseScore: 0,	//calculate and show in feedback
		phraseMultiplier: 1,
		totalPoints: $scope.activeQuiz.currentScore
	};

	$scope.randomMode = false;

	//use to give feedback in alert after every round
	$scope.feedback = {
		trend: 1,	//0 = down, 1 = equal, 2 = up
		show: false,	//use to control ng-if
		type: 1	//0 = red, 1 = yellow, 2 = green
	};

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
	prepareNextRound();
});