var Controller = require(global.appRoot + '/core/controller');

const Chatbot = require('../../service/chatbot.service');

const constantObj = require('../../config/constants');

var commonCore = require(global.appRoot + '/core/common');

var Broadcase = require('../models/entities/configsBroadcase');

var Communication = require('../models/entities/commuications');

var chatbotCtrl = require('../controllers/chatbotCtrl');

var pageAccessToken = constantObj.pageAccessToken ;

var { MessengerClient } = require('messaging-api-messenger');
var client = MessengerClient.connect(pageAccessToken);

class BroadcaseController extends Controller {

  static renderView(req, res){
    console.log('broadcase started');
    res.render('pages/broadCase');
  }

  static getBroadcaseData(req, res){
    Broadcase.findOne({name:'facebook-broadcase'})
    .then(success => {
      if(success){
        res.send({success: true, data: success.data});
      }
      res.send({success: false, data: null});
    })
    .catch(err => {
      res.send({success: false, data: null});
    })
  }

  static addBroadcaseData(req, res){
    let { broadCase } = req.body;

    Broadcase.findOneAndUpdate({name: 'facebook-broadcase'}, {$push: {data: broadCase}})
    .then(success => {
      if(success){
        res.send({success: true})
      } else{

        let newBroadcase = new Broadcase({
          data: [broadCase],
        })

        newBroadcase.save().then(success => {
          res.send({success: true});
        })
        .catch(err => {
          res.send({success: false});
        })
      }
      broadCase.member.forEach(uid => {
        chatbotCtrl.sendTextToUser(client, uid, broadCase.content);
      })
      
    Chatbot.saveMsgBotSendToUser(broadCase.member, broadCase.content);
    })
    .catch(err => {
      res.send({success: false});
    })
  }

  static async getFullnameUser(req, res){
    const { uidArr } = req.body;
   
    await Promise.all(uidArr.map(item => Communication.findOne({uid: item})))
    .then(value => {
      let usernameArr = value.map(user => user.fullname);
      res.send({success: true, data: usernameArr});
    })
    .catch(err => console.log(err.message));

  }

}

module.exports = BroadcaseController;

// var broadcaseSchama = mongoose.Schema({	
//   name:{type:String, default:'facebook-broadcase'},
//   data:[{
//       _id: mongoose.Schema.Types.ObjectId,
//       title:String,
//       description:String,
//       content:String,
//       member:[String],
//   }],
//   system : {type: String, default: 'core'},
//   content:{type:String, default: 'facebook-broadcase'}
// });