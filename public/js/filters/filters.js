app.filter('tagArray', function (){
	return function (array) {
		//for now just output array as CSV
		return array.toString();
	}
});

app.filter('filterLink', function(){
	return function (str, type) {
		// create a <a></a> from the string that contains a URL to filter
		// entries by.
	};
})