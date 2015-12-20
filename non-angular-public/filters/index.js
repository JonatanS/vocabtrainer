module.exports = function (swig) {

	//return the link to a user's dictionary
    var dictListLink = function (dict) {
        return '<a href="' + '../dictionaries/' + dict._id + '/listView">' + dict.name + '</a>';
    };
    dictListLink.safe = true;
    swig.setFilter('dictListLinkFromUser', dictListLink);

    var dictEntryLink = function (entry) {
    	return '<a href="' + '/entries/' + entry._id + '/' + entry.dictId + '/delete">' + 'delete' + '</a>'
    };
    dictEntryLink.safe = true;
    swig.setFilter('dictEntryLink', dictEntryLink);

};