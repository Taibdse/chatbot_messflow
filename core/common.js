const request = require('request');
const fs = require('fs');
const unzip = require('unzip');
var formidable = require('formidable');
var download = require('download-file');

class Common {
	
	//Check object is exit
	static isset(object) {
		if((typeof object == "undefined") || (object == null))
			return null;
		return object;
	};

	//Send request to other website via URL
	static async doRequest(requestData) {
		return new Promise(function (resolve, reject) {
			request(requestData, function (error, res, body) {
				if (!error && res.statusCode == 200) {
					resolve(body);
				} else {
					reject(error);
				}
			});
		});
	}

	//Get file form URL
	static async getFileFromURL(url, directory, filename) {

		var options = {
			directory: directory,
			filename: filename
		}

		return new Promise(function (resolve, reject) {
			//download from url
			download(url, options, function(err){
				    if (err) {
				    	reject(error);
				    } else {
				    	resolve(true);
				    }
				    
				});
		});
	}

	//extract file
	static async extract(filename, outputPath) {
		const stream = fs.createReadStream(zipFile).pipe(unzip.Extract({ path: outputPath }));
		return new Promise((resolve, reject) => {
			let hasError;
			stream.on('error', err => {
				hasError = true;
			});
			stream.on('close', () => {
				if (hasError) {
					reject(false);
					
				} else {
					resolve(true);
				}
			})
		});
	}

	//Create user folder, folder is <User_ID>/topics and <User_ID>/templates
	static createUserFolder(req) {
		let userId = req.session.user._id;
		let userDir = global.appRoot + "/" + userId;
		if (!fs.existsSync(userDir)){
		    fs.mkdirSync(userDir);

		    userDirTopic = userDir + "/topics";
		    userDirTemplates = userDir + "/templates";
		}
	}

	//Create Folder
	static createFolder(path, folderName) {
		let dir = path + "/" + folderName;
		if (!fs.existsSync(dir)){
		    fs.mkdirSync(dir);
		}
	}

}

module.exports = Common;