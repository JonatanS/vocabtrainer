app.factory('EntryFactory', function ($http){
	return {
		create : function (data) {
			return $http.post('/api/entries/', data)
			.then (function (response) {
				var entry = response.data;
				return entry;
			});
		},

		remove: function (id) {
			console.log(id);
			return $http.delete('/api/entries/' + id)
			.then (function (response) {
				return true;
			});
		},

		update: function (entry) {
			console.log("factory:");
			console.log(entry);
			return $http.put('/api/entries/' + entry._id, {entry: entry})
			.then (function (response){
				return response.data;
			});
		}
	};
});