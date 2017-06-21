'use strict';

const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const config = require('./config.json');
const MongoStore = require('connect-mongo')(session);

const mid = require('./middlewares/index');

const userRoutes = require('./controllers/users.js');
const homeRoutes = require('./controllers/home.js');
const pricingVariableRoutes = require('./controllers/pricing_variables.js');
const accountsRoutes = require('./controllers/accounts.js');

// const mid = require('./middlewares/index');
// const pricingVariableRoutes = require('./controllers/pricing_variables.js');

app.use(logger("dev"));
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

app.use('/users', mid.requiresLogin, userRoutes);
app.use('/pricing_variables', mid.requiresLogin, pricingVariableRoutes);
app.use('/accounts', mid.requiresLogin, accountsRoutes);



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

app.listen(port, function(){
	console.log('listening on port ', port);
});