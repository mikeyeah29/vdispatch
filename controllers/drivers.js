'use strict';

const express = require('express');
const drivers = express.Router();
const User = require('../models/user.js').User;
const Driver = require('../models/driver.js').Driver;
const Absence = require('../models/absence.js').Absence;

const routePermission = 'management';

drivers.get('/', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		Driver.find({}).exec(function(err, drivers){

			if(err){
				return next(err);
			}

			res.render('drivers/drivers', {
				title: 'All Drivers',
				user: user,
				drivers: drivers
			});

		});

	});

});

drivers.get('/overview', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}
	
	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		

	});

});

drivers.get('/edit/:driverId', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}
	
	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		

	});

});

drivers.post('/add-absence', function(req, res, next){

	let response = {};
	response.success = 0;

	if(req.session.permissions[0][routePermission] == false){
		response.error = 'Invalid Permissions';
		return res.send(response);
	}

	const absenceData = {
		driver: req.body.driverId,
		startDate: req.body.startDate, 
		endDate: req.body.endDate
	};

	Absence.create(absenceData, function(error, absence){
		
		if(error){
			response.error = error;
			return res.send(response);
		}else{
			
			Absence.find({}).exec(function(err, absences){

				if(err){
					response.error = err;
					return res.send(response);
				}else{
					response.absences = absences;
					response.success = '1';
					return res.send(response);
				}

			});

		}
	
	});

});

drivers.post('/update-absence', function(req, res, next){

});

drivers.post('/remove-absence', function(req, res, next){

});

module.exports = drivers;




// overview

// all

// add new

// edit

// add driver absence