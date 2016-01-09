/*
* MainCtrl: This controller is used for the navbar and other hig-level
*	elements
*/

app.controller('MainCtrl', function ($scope, UserFactory, DictionaryFactory) {
	//TODO: replace this with passport stuffs
	var loggedInUserId = "5691577ddc51a2b71e12f8e8";

	var getUserData = function(){
		$scope.loading = true;
		
		UserFactory.getDictionaries(loggedInUserId)
		.then(function (user){
			$scope.loading = false;
			$scope.user = user;
			console.log('MainCtrlScope:');
			console.log($scope);
		});
	};

	//this function is triggered by the isolated Dict scope
	$scope.removeDictionary = function () {
		console.log($scope)
		console.log(this.dict);
		var dictToRemove = this.dict;
		DictionaryFactory.remove(dictToRemove._id)
		.then (function () {
			//remove dict from scope:
			pos = $scope.user.dictionaries.map(function(d) { return d._id; }).indexOf(dictToRemove._id);
			if (pos !== -1) $scope.user.dictionaries.splice(pos,1);
		});
	};

	$scope.loading = true;
	getUserData();	//populate user scope

});