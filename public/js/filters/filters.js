app.filter('tagArray', function (){
	return function (array) {
		//for now just output array as CSV
		return array.toString();
	}
});

app.filter('filterLink', function(){
	return function (str, type) {

		var inputString = str;
		//check if comma separated:
		console.log(str + ' ' + type);
		
		// create a <a></a> from the string that contains a URL to filter
		// entries by.
	};
})