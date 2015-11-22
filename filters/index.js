module.exports = function (swig) {

	//return the link to a user's dictionary
    var dictListLink = function (dict) {
        return '<a href="' + '../dictionaries/' + dict._id + '/listView">' + dict.name + '</a>';
    };
    dictListLink.safe = true;
    swig.setFilter('dictListLinkFromUser', dictListLink);

};