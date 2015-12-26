app.filter('tagArray', function (){
	return function (array) {
		//for now just output array as CSV
		return array.toString();
	}
});
