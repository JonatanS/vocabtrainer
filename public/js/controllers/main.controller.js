/*
* MainCtrl: This controller is used for the navbar and other hig-level
*	elements
*/

app.controller('MainCtrl', function ($scope, UserFactory) {
	//TODO: replace this with passport stuffs
	var loggedInUserId = "56784be146cb1f170e4d2ec4";

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

	$scope.loading = true;
	getUserData();	//populate user scope

});