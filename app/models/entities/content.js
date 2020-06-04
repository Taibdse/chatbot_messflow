var mongoose = require('mongoose');

//define schema
var contentSchema = mongoose.Schema({
	topic: String,
	user_say: String,
	answer: [String],
	lang: String,
	updatetime: Date,
	value: Object
});

//create model
module.exports = mongoose.model('contents', contentSchema, 'contents');