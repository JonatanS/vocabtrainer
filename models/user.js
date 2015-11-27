var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var passportLocalMongoose = require('passport-local-mongoose');

//mongoose.connect('mongodb://localhost/vocabtrainer');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'mongodb connection error: '));  //log error on unsucessful connection
// db.on('open', function (){ console.log("Succesfully connected to DB User");});


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


//userSchema.plugin(passportLocalMongoose);


//module.exports = mongoose.model('User', userSchema);

//EXPORT MODELS
var User = mongoose.model('User', userSchema);

module.exports = {
	User: User
};