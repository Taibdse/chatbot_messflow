var BotSailBase = require(global.appRoot + "/core/botsailbase.js");

class Controller extends BotSailBase {
	setResponse(req, res) {
		this.req = req;
		this.res = res;
	}


	sendError(err, msg = '')	 {
		let json = {
			status : -1,
			error : err,
			message : msg
		}
		this.res.send(json);	
	};

	sendErrorMessage(msg)	 {
		let json = {
			status : -2,
			error : null,
			message : msg
		}
		this.res.send(json);	
	};

	sendErrorData(msg,data)	 {
		let json = {
			status : -2,
			error : null,
			message : msg,
			data: data
		}
		this.res.send(json);	
	};

	sendError(error)	 {
		let json = {
			status : -2,
			error : error,
		}
		this.res.send(json);	
	};

	sendMessage(msg) {
		let json = {
			status : 1,
			error : null,
			message : msg
		}
		this.res.send(json);
	};

	sendMessageData(msg, data) {
		let json = {
			status : 1,
			error : null,
			message : msg,
			data: data
		}
		this.res.send(json);
	}

	
}

module.exports = Controller;