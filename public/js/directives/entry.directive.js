app.directive('entry', function (){
	return {
		restrict: 'A',
		templateUrl: 'templates/entry.html',
		replace: true,
		scope: { 
			entry: '=',
			index: '@'
		}
		//,link...
	}
});