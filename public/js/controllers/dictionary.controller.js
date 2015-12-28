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

});