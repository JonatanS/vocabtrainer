var mongoose = require ('mongoose');
mongoose.connect('mongodb://localhost/vocabtrainer');
var Schema = mongoose.Schema;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error: '));  //log error on unsucessful connection
db.on('open', function (){ console.log("Succesfully connected to DB");});


// USER SCHEMA
var userSchema = new mongoose.Schema({
	email:{type: String, required: true, unique: true},
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	dateRegistered: {type: Date, default: Date.now},
	lastDictUsedToEnter: String,	//TODO: write get method
	lastDictUsedToTest: String,		//TODO: write get method
	//dictionaryIds: {type: [String] }
});

userSchema.virtual('fullName').get(function () {
	return this.firstName + " " + this.lastName;
});

//DICTIONARY SCHEMA
var languages = ['English', 'French', 'Spanish', 'German', 'Italian'];
var dictSchema = new mongoose.Schema({
	language1: {
		type: String, 
		required: true,
		enum: languages
	},
	language2: {
		type: String, 
		required: true,
		enum: languages
	},
	name: {type: String, unique: true},	//TODO write auto-naming function
	userId: {type: String, required: true},
	entries: [{type: Schema.Types.ObjectId, ref: 'Entry'}]
});

// //write method to return entries for dict from [entryIds]
// dictSchema.method.getEntries = function (){
// 	return Entry.find({
// 	        _id: {$in: this.entries}
// 	}).exec();
// };


//ENTRY SCHEMA
var entrySchema = new mongoose.Schema({
	userId: {type: String, required: true},
	phraseL1: {type: String, required: true, unique: true},
	phraseL2: {type: String, required: true},
	category: {type: String, required: false, enum: ['adverb','adjective','expression','noun','sentence','verb' ]},
	tags: [String],
	mnemonic: String,
	dateCreated: {type: Date, default: Date.now},
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
	return Entry.find({
		tags: { $in: [tag]}
	}).exec();
};


//TEST SCHEMA




//EXPORT MODELS
var User = mongoose.model('User', userSchema);
var Entry = mongoose.model('Entry', entrySchema);
var Dictionary = mongoose.model('Dictionary', dictSchema);

module.exports = {
	User: User,
	Entry: Entry,
	Dictionary: Dictionary
};
