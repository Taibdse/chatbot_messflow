var fs = require('fs');

class BotSailBase {
	
	loadClass(class_path, params = []) {
		if (fs.existsSync(class_path)) {
			ObjectClass = require(class_path);
			return ObjectClass;
		}

		return null;
	};

	loadObject(class_path, params = []) {
		if (fs.existsSync(class_path)) {
			TheClass = this.loadClass();

			if(TheClass != null) {
				if(params != null && params.length > 0) {
					var obj = new TheClass(params);
				} else {
					var obj = new TheClass();
				}

				return obj;
			}

		}
		
		return null;
	};

	showErrorPage(res, error) {
		res.render(global.appRoot + '/app/views/errorpage.ejs', {
								error: error
							 });
	}

	returnJson(res, json) {
		res.send(JSON.stringify(json, null, 3));
	}

	appRootPath() {
		return global.appRoot;
	};

	appThemePath() {
		return global.appRoot + "/app/views/";
	};

	pluginPath() {
		return global.appRoot + '/plugins';
	};

	pluginControllersPath() {
		this.pluginPath() + "/controllers";
	};

	pluginModelsPath() {
		this.pluginPath() + "/models";
	};

	pluginViewsPath() {
		this.pluginPath() + "/views";
	};

	tmpFolder() {
		global.appRoot + "/tmp";
	};

	apiURL() {
		return "http://localhost";
	};


}

module.exports = BotSailBase;