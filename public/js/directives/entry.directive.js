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
			scope.editable = function(){
				//element is jQuery element
				element.attr('contenteditable','true');
				element.addClass('editContent');
				scope.isEditable = true;
			},

			scope.notEditable = function(){
				if(element.attr('contenteditable')) scope.cancelEdit();
				// element.attr('contenteditable', 'false');
				// element.removeClass('editContent');
				// scope.isEditable = false;
			},

			scope.update = function() {
				console.log(scope.entry);
				console.log(element);
				console.log($(element).children("td.entry-phraseL1").html());
				EntryFactory.update({
					phraseL1: $(element).children("td.entry-phraseL1").html(),
					phraseL2: $(element).children("td.entry-phraseL1").html(),
					category: $(element).children("td.entry-category").html(),
					tags: $(element).children("td.entry-tags").html(),
					mnemonic: $(element).children("td.entry-mnemonic").html(),
					level: $(element).children("td.entry-level").html(),
					_id: scope.entry._id
				})

			},

			scope.cancelEdit = function () {
				element.attr('contenteditable', 'false');
				element.removeClass('editContent');
				scope.isEditable = false;
			},

			scope.isEditable = false;
		}
	}
});