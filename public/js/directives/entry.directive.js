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

			scope.readWrite = function(){
				console.log("dblc");
				element.removeAttr('readonly');
				console.log(element);

			},

			scope.onChange = function(){
				console.log("Dirty");
				element.addClass('editContent');
				scope.isEditable = true;
			},

			scope.notEditable = function(){
				if(element.attr('contenteditable')) scope.cancelEdit();
			},

			scope.update = function() {
				console.log(scope.entry);
				console.log("Updating: ", $(element).children("td.entry-phraseL1").children("input").val());
				EntryFactory.update({
					phraseL1: $(element).children("td.entry-phraseL1").children("input").val(),
					phraseL2: $(element).children("td.entry-phraseL2").html(),
					category: $(element).children("td.entry-category").html(),
					tags: $(element).children("td.entry-tags").html(),
					mnemonic: $(element).children("td.entry-mnemonic").html(),
					level: $(element).children("td.entry-level").html(),
					_id: scope.entry._id
				})

			},

			scope.cancelEdit = function (form) {
				element.attr('contenteditable', 'false');
				element.removeClass('editContent');
				scope.isEditable = false;
				//reset input form:
				if(form){
	      			form.$setPristine();
	      			form.$setUntouched();
    			};

    			//TODO: load old entry:
			},

			scope.isEditable = false;
		}
	}
});