var Controller    = require(global.appRoot + '/core/controller');

const Communication = require('../../app/models/entities/commuications');
const LastMsg = require('../../app/models/entities/configsChatbot');

class ChatbotMsgController extends Controller{

    static renderView(req, res){
        console.log('started');
        res.render('pages/msgChatbot');
    }

    static getAllLastMsg(req, res){
        LastMsg.find({name: 'last-message'})
        .then(success => {
            if(success) {
                res.send({success: true, data: success[0].data});
            } 
            else res.send({success: false, data: null});
        })
        .catch(err => {
            console.log('err')
            console.log(err.message);
            res.send({success: false, data: null});
        })  
    }

    static getDataOneUser(req, res){
        Communication.findById(req.body._id)
        .then(success => {
            if(success) return res.send({success: true, data: success});
            res.send({success: false, data: null});
        })
        .catch(err => {
            console.log(err.message);
            res.send({success: false, data: null});
        })
    }

}

module.exports = ChatbotMsgController
