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
}, 
	{toJSON: { virtuals: true }, toObject: { virtuals: true }}	//set options to return virtuals in JSON
);

entrySchema.virtual('type').get(function(){
	if (this.phraseL1.split(' ').length === 1 && this.phraseL2.split(' ').length ===1) return 'word';
	if (this.phraseL1.split(' ').length === 2 && this.phraseL2.split(' ').length ===2 && this.category ==='noun') return 'word';
	return 'phrase';
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

//QUIZ SCHEMAS
var quizSchema = new mongoose.Schema({
	dictionary: {type: Schema.Types.ObjectId, ref: 'Dictionary', required: true},
	name: {type: String, required: true},
	filter_weekFrom: Number,
	filter_weekTo: Number,
	filter_levels: [Number],
	filter_tags: [String],
	filter_categories: [String],
	dateLastTested: {type: Date},
	timesTested: {type: Number, default: 0},
	avgScore: {type: Number, default: 0},
	lastScore: {type: Number, default: 0}
}, 
	{toJSON: { virtuals: true }, toObject: { virtuals: true }}
);

var quizEntrySchema = new mongoose.Schema({
	quiz: {type: Schema.Types.ObjectId, ref: 'Quiz', required: true},
	entry: {type: Schema.Types.ObjectId, ref: 'Entry', required: true},
	mute: {type: Boolean, default: false},
	dateLastTested: {type: Date},
	numAttempts: {type: Number, default: 0},
	avgScore: {type: Number, default: 0},
	lastScore: {type: Number, default: 0}
});

//EXPORT MODELS
var User = mongoose.model('User', userSchema);
var Entry = mongoose.model('Entry', entrySchema);
var Dictionary = mongoose.model('Dictionary', dictSchema);
var Quiz = mongoose.model('Quiz', quizSchema);
var QuizEntry = mongoose.model('QuizEntry', quizEntrySchema);
//var Account = mongoose.model('Account', accountSchema);

module.exports = {
	User: User,
	Entry: Entry,
	Dictionary: Dictionary,
	Quiz: Quiz,
	QuizEntry: QuizEntry
};
