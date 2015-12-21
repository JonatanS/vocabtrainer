app.controller('MainCtrl', function ($scope, UserFactory) {
	if(!$scope.user) {
		var firstUser = UserFactory.getUsers()[0]
	} 
});