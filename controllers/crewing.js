'use strict';

const express = require('express');
const crewing = express.Router();
const User = require('../models/user.js').User;
const Account = require('../models/account.js').Account;
const Booking = require('../models/booking.js').Booking;
const Locaton = require('../models/location.js').Locaton;
const CrewingDefault = require('../models/crewing_default').CrewingDefault;
const VehicleType = require('../models/vehicle_type').VehicleType;
const helper = require('../helpers/main.js');
const mid = require('../middlewares/index');

const routePermission = 'reservations';

// /crewing

crewing.get('/', mid.requiresLogin, function(req, res, next){

	// dafaults

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId, function(err, user){

		if(err){
			return next(err);
		}

		CrewingDefault.find({}).populate('hotel').populate('pricing.vehicle').exec(function(err, crewing){

			if(err){
				return next(err);
			}

			console.log('crewing ', crewing);

			res.render('crewing/defaults', {
				title: 'Crewing',
				user: user,
				crewing: crewing
			});

		});

	});

});

crewing.get('/transfers', mid.requiresLogin, function(req, res){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}
	
	User.findById(req.session.userId, function(err, user){

		if(err){
			return next(err);
		}

		CrewingDefault.find({}, function(err, crewing){

			if(err){
				return next(err);
			}			

			res.render('crewing/transfers', {
				title: 'Crewing',
				crewing: crewing,
				user: user
			});

		});

	});

});

crewing.get('/search', mid.requiresLogin, function(req, res){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId, function(err, user){

		if(err){
			return next(err);
		}

		res.render('crewing/search', {
			title: 'Crewing',
			user: user
		});

	});

});

module.exports = crewing;