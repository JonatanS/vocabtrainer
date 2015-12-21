app.factory("UserFactory", function ("$http"){
	return {
		getUsers : function (){
			return $http.get('/api/users/')
			.then( function (response) {
				var users = response.data;
				return users;
			});
		},
		getDictionaries : function (userId){
			return $http.get('/api/users/' + userId)
			.then( function (response) {
				var user = response.data;
				return user;
			});
		}
	};
});