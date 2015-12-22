app.controller("DictionaryCtrl", function ($scope, activeDictionary, EntryFactory) {
	$scope.activeDictionary = activeDictionary;

	$scope.createEntry = function () {
		console.log("must make new entry in dict ctrl");
		console.dir(activeDictionary);

		console.log($scope.newEntry);
		return EntryFactory.create($scope.newEntry)
		.then(function (addedEntry){
			$scope.activeDictionary.entries.push(addedEntry);
				$scope.newEntry = {
				user : activeDictionary.user,
				dict : activeDictionary
			};
			return addedEntry;
		});
	};

	$scope.newEntry = {
		user : activeDictionary.user,
		dict : activeDictionary
	};
});