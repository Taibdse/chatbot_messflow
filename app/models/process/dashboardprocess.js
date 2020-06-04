var Common 			= 	require(global.appRoot + "/core/common.js");
var BotSailBase = require(global.appRoot + "/core/botsailbase");

class DashboardProcess extends BotSailBase {
	static async getDashboarData() {
		let obj = {};
		obj['topicCnt'] = 1;
		obj['pluginCnt'] = 2;
		obj['contentCnt'] = 3;
		obj['templateCnt'] = 4;

		return obj;
	};

}

module.exports = DashboardProcess;