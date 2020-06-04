var mongoose = require("mongoose");
var Controller = require(global.appRoot + '/core/controller');


class ContentController extends Controller{
	static contentdetail(req, res) {
		let data = {
			id: '',
			user_say: '',
			answer : [''],
		};

		res.render("pages/content.ejs" ,{data:data });
	}

	static editdetail(req, res){
		Controller.prototype.setResponse(req, res);
		//res.render("pages/content.ejs", {user_say: req.query.user_say, answer: req.query.answer});
		var id = mongoose.Types.ObjectId(req.query.id);
		Content.findOne({_id: id}, function(err, data){
			if(err){
				Controller.prototype.sendErrorMessage("error" + err);
			}else{
				Controller.prototype.sendMessage("success");
			}
		})
	}

	//Process database
	static save(req, res){  //save 
		Controller.prototype.setResponse(req, res);
		//Validation
		req.params = req.body;
		req.check('user_say','User says  is require').notEmpty();
 		req.check('answer','Answer is require').notEmpty();
 		var errors = req.validationErrors();

 		if(errors != false) {
 			Controller.prototype.sendError(errors);
 			return;
 		}

		var data = Content ({
							topic: req.body.topic,
							user_say: req.body.user_say ,
							answer: req.body.answer,
							lang: "vi",
							updatetime: req.body.updatetime}
						);

		//if req.body.id has id. We will update else we will create a new one
		if(req.body.id == "" || req.body.id == null){
			data.save(function(err, result){
				if(err){
					Controller.prototype.sendErrorMessage("error" + err);
				}else

					Controller.prototype.sendMessage("success");
			});
		}else{
			var id = mongoose.Types.ObjectId(req.body.id);
			Content.findOne({_id: id}, function(err, found){
				if(err){
					res.send("error");
				}else{
					found.user_say = data.user_say;
					found.answer = data.answer;
					found.save(function(err){
						if(err){
							Controller.prototype.sendErrorMessage("error" + err);
						}else{
							Controller.prototype.sendMessage("success");
						}
					})
					
				}
			});
		}
	}

	//return the Content having the topic = req.body.topic
	static show(req, res){ 
		Controller.prototype.setResponse(req, res);
		Content.find({topic: req.body.topic}, function(err, found){
			if(err){
				Controller.prototype.sendErrorMessage("error" + err);
			}else{
				Controller.prototype.sendMessage("success");
			}
		});
		
	}


	//delete the tuple having same id
	static delete(req, res){
		var id = mongoose.Types.ObjectId(req.body._id);
		Content.remove({_id: id}, function(err){
			if(err){
				Controller.prototype.sendErrorMessage("error" + err);
			}else{
				Controller.prototype.sendMessage("success");
			}

		});
	}

	//return the Content to client to edit
	static edit(req, res){
		var id = mongoose.Types.ObjectId(req.body._id);
		Content.findOne({_id: id}, function(err, found){
			if(err){
				Controller.prototype.sendErrorMessage("error" + err);
			}else{
				Controller.prototype.sendMessage("success");
			}
		})
	}


	
}

module.exports = ContentController;