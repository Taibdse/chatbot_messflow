const Controller = require(global.appRoot + '/core/controller');

const Chatbot = require('../../service/chatbot.service');

const commonCore = require(global.appRoot + '/core/common');

//require model database
const TagConfig = require('../models/entities/tagConfig');//tga info
const Communication = require('../models/entities/commuications');//message of user
const ConfigsChatbot = require('../models/entities/configsChatbot');//last message

class TagsListController extends Controller {

    static renderTagList(req, res){
      res.render('pages/tagPage/tags_list');
    }

    static renderInputtagView(req, res){
       res.render('pages/tagPage/input_tag');
    }

    static renderEdittagView(req, res){
      const { tagName } = req.params;
      console.log(tagName);
      res.render('pages/tagPage/edit_tag', { tagName });
    }

    static async getAllUsersByTagname(req, res){
      let { tagName } = req.body;
      if(tagName) tagName = tagName.trim();
      console.log('tagname ' + tagName);
      Communication.find({tag: tagName})
      .then( async (success) => {
        if(success){
          console.log('communication: ' + success);

          // let lastMsg = await ConfigsChatbot.findOne({name: 'last-message'});

          // let filter = lastMsg.data.filter(msg => success.indexOf(msg._id) > -1);

          res.send({success: true, data: success});
        }
      })
      .catch(err => {
        console.log(err.message);
        res.send({success: false});
      })
    }

    static async getTagsList(req, res){
      TagConfig.findOne({name:'tag'})
      .then(success => {
        if(success) res.send({success: true, data: success.data})
      })
      .catch(err => {
        console.log(err.message);
        res.send({success: false, data: null})
      })
    }

    static async removeTag(req, res){
      let { tagName } = req.body;
      if(tagName) tagName = tagName.trim();
      console.log(tagName);
      //delete tag name in data array
      const tagUpdated = await TagConfig.findOneAndUpdate({name: 'tag'}, {$pull: {data: tagName}}, {new: true});

      if(tagUpdated){
        Communication.updateMany({ }, {$pull:  { tag: tagName }}, { multi: true })
        .then(success => {
          if(success) {
            return res.send({success: true}); 
          }
        })
        .catch(err => {
          console.log(err.message);
          res.send({success: false});
        })
      }
    }

    static async removeUserTag(req, res){
      let { idUser, tagName } = req.body;
      if(tagName) tagName = tagName.trim();
      Communication.findByIdAndUpdate(idUser, {$pull: {tag: tagName}})
      .then(success => {
        if(success) return res.send({success: true});
      })
      .catch(err => {
        console.log(err.message);
        res.send({success: false});
      })
    }

    static async updateTagName(req, res){
      const {oldTagName, newTagName} = req.body;
      TagConfig.findOneAndUpdate({name:'tag', data: oldTagName}, {$set: {'data.$':newTagName}})
      .then(async (success) => {
        if(success) {
          const updateCom = await Communication.updateMany({ tag: oldTagName }, { $set: { 'tag.$': newTagName } });
          if(updateCom){
            res.send({success: true})
          }
        }
      })
      .catch(err => {
        console.log(err.message);
        res.send({success: false});
      })
    }

    static async addTagToUsers(req, res){
      let { tagName, idUsers } = req.body;

      console.log(tagName, idUsers);

      if(tagName && idUsers){
          //check if tag collection already had a tag
          let oldTag = await TagConfig.findOne({name: 'tag'});
          
          if(oldTag){
            let tag = await TagConfig.findOneAndUpdate({name: 'tag'}, {$push: {data: tagName}})
            if(tag){
              idUsers.forEach(async (idUser) => {
                let userAddedtag = await Communication.findByIdAndUpdate(idUser, {$push : {tag: tagName}});
              })
              res.send({success: true});
            }
          }else{
            //create the first tag document
            let data = [tagName];
            let firstTag = new TagConfig({data});
            let newtag = await firstTag.save();
            if(newtag){
              idUsers.forEach(async (idUser) => {
                let userAddedtag = await Communication.findByIdAndUpdate(idUser, {$push : {tag: tagName}});
              })
              res.send({success: true});
            }
          }
      }else{
        res.send({success: false, msg: 'NO_TAGNAME_OR_NO_IDUSER'})
      }
    }

    static async getAllUser(req, res){
      Communication.find({ })
      .then(success => {
        if(success)
        return res.send({success: true, data: success});
        res.send({success: false});
      })
      .catch(err => {
        console.log(err.message);
        res.send({success: false});
      })
    }

}

module.exports = TagsListController;

// name:{ type:String },
// data:[String],
// system:{ type:String, default:'core' },
// content:{ type:String, default:'tag' }

// var communicationSchama = mongoose.Schema({	
//   type:{type:String, default:'messager'},
//   uid:String,
//   fullname:String,
//   gender:String,
//   data: [{
//       time:Number,
//       who:String,//guest, bot
//       message:String
//   }],
//   tags:[]
// });

// name:{type:String, default:'last-message'},
//     data:[{
//         _id: mongoose.Schema.Types.ObjectId,
//         type: {type:String, default: 'messager'},
//         uid:String,
//         fullname:String,
//         gender:String,
//         data:[ //just 2 elements
//             {
//                 time:Number,
//                 who:String,
//                 message:String
//             }
//         ]
//     }],
//     system : {type: String, default: 'core'},
//     content:{type:String, default: 'last-message'}