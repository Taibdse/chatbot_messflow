var config = require('../entities/config');

class MenuBar {
	async getFullMenuDB() {
		let result = await config.find({});
		console.dir(result);
		config.findOne({}, function (err, docs) {
			if (err)
				console.log('error occured in the database');
			console.log(docs);
		});
		return result;
	}
};

module.exports = MenuBar;