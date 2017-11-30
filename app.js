'use strict';

const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
let config = '';

if(process.env.NODE_ENV == 'test'){
	config = require('./config/test.json');
}else{
	config = require('./config/dev.json');
}

const MongoStore = require('connect-mongo')(session);
const fileUpload = require('express-fileupload');
const autoIncrement = require('mongoose-auto-increment');

const mid = require('./middlewares/index');

const userRoutes = require('./controllers/users.js');
const homeRoutes = require('./controllers/home.js');

const apiRoutes = require('./controllers/api.js');
const imgLibRoutes = require('./controllers/api/image_library.js');
const bookingApiRoutes = require('./controllers/api/bookings.js');
const crewingApiRoutes = require('./controllers/api/crewing.js');
const locationApiRoutes = require('./controllers/api/locations.js');

const pricingVariableRoutes = require('./controllers/pricing_variables.js');
const rateSheetRoutes = require('./controllers/ratesheets.js');
const accountsRoutes = require('./controllers/accounts.js');
const driverRoutes = require('./controllers/drivers.js');
const vehiclesRoutes = require('./controllers/vehicles.js');
const bookingRoutes = require('./controllers/bookings.js');
const crewingRoutes = require('./controllers/crewing.js');
const dispatchRoutes = require('./controllers/dispatch.js');

// const mid = require('./middlewares/index');
// const pricingVariableRoutes = require('./controllers/pricing_variables.js');

app.use(fileUpload());

if(process.env.NODE_ENV !== 'test'){
	app.use(logger("dev"));
}
// app.use(jsonParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

// view engine
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// Mongo Database stuff
var mongoose = require("mongoose");
mongoose.connect(config.mongo_uri);
var db = mongoose.connection; 

// autoIncrement.initialize(db);

db.on("error", function(err){
	console.error("Connection error: ", err);
});
db.once("open", function(){
	console.log("Connection Successful");
});

app.use(session({
	secret: 'things and stuff',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db
	})
}));

app.use(function(req, res, next){
	res.locals.currentUser = req.session.userId;
	next();
});

// routes / controllers

app.use('/', homeRoutes);
app.use('/api', apiRoutes);
app.use('/api/image_library', imgLibRoutes);
app.use('/api/bookings', bookingApiRoutes);
app.use('/api/crewing', crewingApiRoutes);
app.use('/api/locations', locationApiRoutes);

app.use('/users', mid.requiresLogin, userRoutes);
app.use('/pricing_variables', mid.requiresLogin, pricingVariableRoutes);
app.use('/ratesheets', mid.requiresLogin, rateSheetRoutes);

app.use('/accounts', mid.requiresLogin, accountsRoutes);
app.use('/drivers', mid.requiresLogin, driverRoutes);
app.use('/vehicles', vehiclesRoutes);
app.use('/booking', bookingRoutes);
app.use('/crewing', crewingRoutes);
app.use('/dispatch', dispatchRoutes);

// catch 404 error and forward to handler
app.use(function(req, res, next){
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// Error Handler
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.json({
		error: err.message
	});
});

const port = process.env.PORT || 3000;

var server = app.listen(port, function(){
	console.log('listening on port ', port);
	// done();
});

module.exports = server;