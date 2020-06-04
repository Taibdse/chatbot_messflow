
var mongoose = require('mongoose');

//define the schema for our menu model
var menuSchema = mongoose.Schema({	
	id:{ type: Number },
	source: String,
	name: String,
	url: String,
	parent_id:  { type: Number, default: -1 },
	css_class: String,
	authenticate: Boolean,
	plugin: String,
});

//create the model for menu and expose it to our app
module.exports = mongoose.model('menus', menuSchema, 'menus');