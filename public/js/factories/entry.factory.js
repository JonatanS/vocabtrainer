app.factory('EntryFactory', function ($http){
	return {
		create : function (data) {
			return $http.post('/api/entries/', data)
			.then (function (response) {
				var entry = response.data;
				console.log("added entry: " + JSON.stringify(entry));
				return entry;
			});
		}
	};
});