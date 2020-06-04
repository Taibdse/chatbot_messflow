var express = require('express');
var path = require('path');
global.appRoot = path.resolve(__dirname);

var app = express();
//var multer = require('multer');
var constants = require('constants');
var constant = require('./config/constants');
//var site = require('./app/controllers/site');     //Main controller

var port = process.env.PORT || 8042;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var fs = require('fs');
var morgan = require('morgan');
var rfs = require('rotating-file-stream');
var logger = require('express-logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var LokiStore = require('connect-loki')(session);
var validator = require('express-validator');

var server = require('http').Server(app);
const fileUpload = require('express-fileupload');

/***************Mongodb configuratrion********************/
var mongoose = require('mongoose');
var configDB = null;
//configuration ===============================================================
if (fs.existsSync(appRoot + "/config/database.js")) {
    configDB = configDB = require('./config/database.js');
    mongoose.connect(configDB.url, (err) => {
        if(err) process.exit(1);
        console.log('database connected');
    }); // connect to our database  
} 


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

// default options
app.use(fileUpload());

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');


// load our webhooks and pass in our app and fully configured passport
var routePath="./webhooks/"; //add one folder then put your route files there my router folder name is routers

var chatbotRoute = require('./routers/routes');
chatbotRoute(app, passport);

//launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

exports = module.exports = app;