app.controller("DictionaryCtrl", function ($scope, activeDictionary, EntryFactory) {
	$scope.activeDictionary = activeDictionary;
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

	//randomly pick a phrase to translate:
	$scope.pickPhraseToQuiz = function(random) {
		if(!$scope.idx && $scope.idx!==0) $scope.idx = -1;
		if(random) {
			$scope.idx = Math.floor((Math.random() * $scope.entriesToQuiz.length - 1) + 1);
		}
		else {
			console.log($scope.idx);
			$scope.idx = ($scope.idx < $scope.entriesToQuiz.length - 2 ? $scope.idx+1 : 0);
			console.log($scope.idx);
		}
		$scope.currentPhrase = $scope.entriesToQuiz[$scope.idx];
		console.log($scope.currentPhrase);
	};

	$scope.evaluateSubmission = function(){
		console.log($scope.submission.answer);
		$scope.submission.answer = null;
		$scope.pickPhraseToQuiz(false);
	};

	$scope.setEntriesToQuiz = function(selectionCriteria) {
		//TODO: filter selection based on criteria. for now take entire dict:
		$scope.entriesToQuiz = angular.copy($scope.activeDictionary.entries);
		console.log("Entries to quiz:");
		console.log($scope.entriesToQuiz);
	}

	$scope.setEntriesToQuiz({});
	$scope.pickPhraseToQuiz(false);

});