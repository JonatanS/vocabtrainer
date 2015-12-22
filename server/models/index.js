var mongoose = require ('mongoose');
mongoose.connect('mongodb://localhost/vocabtrainer');
var Schema = mongoose.Schema;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error: '));  //log error on unsucessful connection
db.on('open', function (){ console.log("Succesfully connected to DB");});


// USER SCHEMA
var userSchema = new Schema({
	email:{type: String, required: true, unique: true},
	//password: String,
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	dateRegistered: {type: Date, default: Date.now, required: true},
	lastDictUsedToEnter: String,	//TODO: write get method
	lastDictUsedToTest: String,		//TODO: write get method
	//dictionaryIds: {type: [String] }
});

userSchema.virtual('fullName').get(function () {
	return this.firstName + " " + this.lastName;
});

userSchema.statics.findOrCreate = function (userInfo) {
    var self = this;
    return this.findOne({ email: userInfo.email }).exec()
        .then(function (user) {
            if (user === null) {
                return self.create(userInfo);
            } else {
                return user;
            }
        });
};


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
	user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	isPublic: {type: Boolean, default: false, required: true}
});

dictSchema.statics.findOrCreate = function (dictInfo) {
    var self = this;

    return this.findOne({ name: dictInfo.name }).exec()
        .then(function (dict) {
            if (dict === null) {
            	console.log("Creating new Dictionary for user: " + dictInfo.user);
                return self.create(dictInfo);
            } else {
                return dict;
            }
        });
};


// //write method to return entries for dict from [entryIds]
// dictSchema.method.getEntries = function (){
// 	return Entry.find({
// 	        _id: {$in: this.entries}
// 	}).exec();
// };


//ENTRY SCHEMA
var entrySchema = new mongoose.Schema({
	//http://stackoverflow.com/questions/14992123/finding-a-mongodb-document-by-objectid-with-mongoose
	user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	dictionary: {type: Schema.Types.ObjectId, ref: 'Dictionary', required: true},
	phraseL1: {type: String, required: true},
	phraseL2: {type: String, required: true},
	category: {type: String, required: false, enum: ['adverb','adjective','expression','noun','sentence','verb' ]},
	tags: [String],
	mnemonic: String,
	dateCreated: {type: Date, default: Date.now},
	dateUpdated: {type: Date},
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

entrySchema.statics.findOrCreate = function (entryInfo){
    var self = this;

    return this.findOne({ user: entryInfo.user, phraseL1: entryInfo.phraseL1, phraseL2: entryInfo.phraseL2}).exec()
        .then(function (dict) {
            if (dict === null) {
                return self.create(entryInfo);
            } else {
                return dict;
            }
        });
};

// var passportLocalMongoose = require('passport-local-mongoose');
// var accountSchema = new mongoose.Schema({
//     email: String,
//     password: String
// });

// accountSchema.plugin(passportLocalMongoose);

//TEST SCHEMA




//EXPORT MODELS
var User = mongoose.model('User', userSchema);
var Entry = mongoose.model('Entry', entrySchema);
var Dictionary = mongoose.model('Dictionary', dictSchema);
//var Account = mongoose.model('Account', accountSchema);

module.exports = {
	User: User,
	Entry: Entry,
	Dictionary: Dictionary
};