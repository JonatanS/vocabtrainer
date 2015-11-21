var mongoose = require ('mongoose');
mongoose.connect('mongodb://localhost/vocabtrainer');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error: '));  //log error on unsucessful connection
db.on('open', function (){ console.log("Succesfully connected to DB");});


// USER SCHEMA
var userSchema = new mongoose.Schema({
	email:{type: String, required: true, unique: true},
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	lastDictUsedToEnter: String,	//TODO: write get method
	lastDictUsedToTest: String,		//TODO: write get method
	dictionaryIds: {type: [String] }
});

userSchema.virtual('fullName').get(function () {
	return this.firstName + " " + this.lastName;
});


//DICTIONARY SCHEMA
var dictSchema = new mongoose.Schema({
	language1: {
		type: String, 
		required: true
		enum: ['English', 'French', 'Spanish', 'German', 'Italian']
	},
	language2: {
		type: String, 
		required: true
		enum: ['English', 'French', 'Spanish', 'German', 'Italian']
	},
	userId: {type: String, required: true},
	entries: {type: [String]}
});


//ENTRY SCHEMA
var entrySchema = new mongoose.Schema({
	userId: {type: String, required: true},
	phraseL1: {type: String, required: true},
	phraseL2: {type: String, required: true},
	category: {type: String, required: true, enum: ['adverb','adjective','noun', 'verb' ]},
	tags: [String],
	dateCreated: {type: Date, default: Date.now}
	dateUpdated: {type: Date},
	dateLastTested: {type: Date},
	lastAnswerSuccessful: {type: Boolean},
	percentSuccess: {type: Number},
	like: {type: Number, enum: [1,2,3]},
	level: {type: Number, enum: [1,2,3,4,5]}
});

entrySchema.virtual('type').get(function(){
	if (this.phraseL1.length === 1 && this.phraseL2.length ===1) return 'word';
	else return 'phrase';
});

entrySchema.statics.findByTag = function (tag) {
	return this.find({
		tags: { $in: this.tags}
	}).exec();
}



//TEST SCHEMA



var User = mongoose.model('User', userSchema);
var Entry = mongoose.model('Entry', entrySchema);
var Dictionary = mongoose.model('Dictionary', dictSchema);

module.exports = {
	User: User,
	Entry: Entry,
	Dictionary: Dictionary
};








