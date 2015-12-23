app.controller('MainCtrl', function ($scope, UserFactory) {
	//TODO: replace this with passport stuffs
	//var loggedInUserId = "56784be146cb1f170e4d2ec4";
	var loggedInUserId = "567aba6fe2886de20543e873";
	

	var getUserData = function(){
		$scope.loading = true;
		
		UserFactory.getDictionaries(loggedInUserId)
		.then(function (user){
			$scope.loading = false;
			$scope.user = user;
		});
	};

	$scope.loading = true;
	getUserData();	//populate user scope

});