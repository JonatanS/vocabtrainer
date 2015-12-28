app.directive('entry', function (EntryFactory){
	return {
		restrict: 'A',
		templateUrl: 'templates/entry.html',
		replace: true,
		scope: { 
			entry: '=',	//two-way binding: entry="theEntry"
			index: '@',	//one-way binding
			remove: '&'	//tied to parentScope.removeEntry(entry),
			
		},
		link: function (scope, element) {
			scope.onDoubleclick = function(){
				console.log("DBL!");
				scope.isEditable = !scope.isEditable;
				scope.formId = element.id;
				if(scope.isEditable) {
					//store state of entry before editing in case we need to reset it
					angular.copy(scope.entry, scope.previousEntry);
				}
			},

			scope.onChange = function(){
				console.log("Dirty");
				scope.hasChanged = true;
				element.addClass("success");	//color bootstrap green
			},

			scope.update = function() {
				console.log("Updating: ");
				console.log(scope.entry);
				EntryFactory.update({
					phraseL1: $(element).children("td.entry-phraseL1").children("input").val(),
					phraseL2: scope.entry.phraseL2,
					category: scope.entry.category,
					tags: scope.entry.tags.toString(),	//need to convert array to string
					mnemonic: scope.entry.mnemonic,
					level: scope.entry.level,
					_id: scope.entry._id
				}).then(function(){
					scope.resetForm(form); //reset input form
				});
			},

			scope.cancelEdit = function (form) {
				scope.isEditable = false;
				scope.hasChanged = false;
				scope.resetForm(form); //reset input form
    			angular.copy(scope.previousEntry, scope.entry); //reset scope.entry with old entry
    			scope.previousEntry = {};

			},

			scope.resetForm = function (form) {
				if(form){
	      			form.$setPristine();
	      			form.$setUntouched();
					element.removeClass("success");	//color bootstrap green
					//http://htmlasks.com/how_do_i_reset_input_autocomplete_styles
	      			//form.reset();//not working since i am using ng-form and not form
    			};
			},

			//todo: auto-list tags: http://jsfiddle.net/sebmade/swfjT/

			scope.isEditable = false,
			scope.hasChanged = false,
			scope.previousEntry = {}
		}
	}
});