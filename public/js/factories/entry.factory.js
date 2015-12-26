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
				console.log(response.data);
				return true;
			});
		},

		update: function (entry) {
			console.log(entry);
			return $http.put('/api/entries/' + entry._id, {entry: entry})
			.then (function (response){
				console.log("done updating:");
				console.log(response.data);
				return response.data;
			});
		}
	};
});