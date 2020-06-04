var User = require('../models/entities/user');
var Config = require('../models/entities/config');
var Content = require('../models/entities/content');
var plugin_root_path = global.appRoot + '/plugins';
var Controller = require(global.appRoot + '/core/controller');
var DashboardProcess = require('../models/process/dashboardprocess');

var ConfigMenuJson = require('../models/entities/configMenuJson');

class BSAdminController extends Controller {
	static loggedIn(req, res, next) {
		if (req.session.user) { // req.session.passport._id
			next();
		} else {
			res.redirect('/login');
		}
	}

	//Home page
	static async home(req, res) {
		res.redirect('/bs-admin/content/show');
	}

	//Signup page
	static signup(req, res) {
		if (req.session.user) {
			res.redirect('/bs-admin/home');
		} else {
			res.render('pages/signup', {
				error: req.flash("error"),
				success: req.flash("success"),
				session: req.session
			});
		}
	}

	//Signup login page
	static login(req, res) {
		if (req.session.user) {
			res.redirect('/bs-admin/home');
		} else {
			res.render('pages/login', {
				error: req.flash("error"),
				success: req.flash("success"),
				session: req.session
			});
		}
	}

	//Menu json 
	static menu(req, res) {
		ConfigMenuJson.findOne({
			"content": "system-menu",
			"system": "core"
		}, function (err, result) {
			if (err) res.send(JSON.stringify({
				'return': '0'
			}, null, 3));
			res.send(result.data);
		});
	}
}

module.exports = BSAdminController;