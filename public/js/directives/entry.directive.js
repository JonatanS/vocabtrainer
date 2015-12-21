app.directive('entry', function (){
	return {
		restrict: 'E',
		templateUrl: 'templates/entry',
		scope: { entry: '='
		}
		//,link...
	}
});