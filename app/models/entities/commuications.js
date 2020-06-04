var mongoose = require('mongoose');

var communicationSchama = mongoose.Schema({	
    type:{type:String, default:'messager'},
    uid:String,
    fullname:String,
    gender:String,
    data: [{
        time:Number,
        who:String,//guest, bot
        message:String
    }],
    tag:[String]
});


const Communication = mongoose.model('communications', communicationSchama, 'communications');

module.exports = Communication;

							
