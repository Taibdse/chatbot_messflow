var fs = require('fs'); 

class UpdateModule {
	// Find all folders
	findFolder(dir, jsFolders){			
		fs.readdirSync(dir).forEach(function(file) {
			if(file != excFolder){					
				var stat;
				stat = fs.lstatSync("" + dir + "/" + file);
				if(stat.isDirectory()){
					jsFolders.push("" + dir + "/" + file);
					findFolder("" + dir + "/" + file, jsFolders);
				}
			}	
		})
		return jsFolders;
	};

	// Find all files in folder
	findFile(dir, jsFiles){		
		fs.readdirSync(dir).forEach(function(file) {
			if(file != excFolder){
				var stat;
				stat = fs.lstatSync("" + dir + "/" + file);
				if(stat.isDirectory()){
					findFile("" + dir + "/" + file, jsFiles);
				}else{
					jsFiles.push("" + dir + "/" + file);
				}
			}
		});	
	}; 

	updateFolder(source, target){	
		var foldersSource = []; 
		var filesSource = [];
		findFolder(source, foldersSource);		
		findFile(source, filesSource);		
		
		// Update folder
		foldersSource.forEach(function(folder){
			var start, len;
			start = source.length;
			len = folder.length - start;
			var path = folder.substr(start, len);		
			var dirFolder = target + path;
			if (!fs.existsSync(dirFolder)){
				fs.mkdirSync(dirFolder);
			}
		})
		
		// Update file
		filesSource.forEach(function(file){
			var start, len;
			start = source.length;
			len = file.length - start;
			var path = file.substr(start, len);
			var dirFileTarget = target + path;		
			
			if (!fs.existsSync(dirFileTarget)) {
				var stat;		
				stat = fs.lstatSync(file);				
				if(stat.isFile()){
					fs.createReadStream(file).pipe(fs.createWriteStream(dirFileTarget));
				}
			}
		})
	}

	updateRooters(rootersPath) {
		if (fs.existsSync(rootersPath)) {
			this->updateFolder(rootersPath, global.appRoot + "/routers");
		}
	}

	updateWebhooks(webhooksPath) {
		if (fs.existsSync(webhooksPath)) {
			this->updateFolder(webhooksPath, global.appRoot + "/webhooks");
		}
	}

	updatePlugins(pluginsPath) {
		if (fs.existsSync(pluginsPath)) {
			this->updateFolder(pluginsPath, global.appRoot + "/plugins");
		}
	}

	update(srcPath) {
		this->updateRooters(srcPath + "/routers");
		this->updateWebhooks(srcPath + "/webhooks");
		this->updatePlugins(srcPath + "/plugins");
	}
}