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

	let postObj = {};

	User.findById(req.session.userId, function(err, user){

		if(err){
			return next(err);
		}

		CrewingDefault.find({}, function(err, crewing){

			if(err){
				return next(err);
			}	

			res.render('crewing/search', {
				title: 'Crewing',
				crewing: crewing,
				user: user,
				postObj: postObj
			});

		});

	});

});

crewing.post('/search', mid.requiresLogin, function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	let postObj = {};

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		let q1 = {isCrewing: true};
		let q2 = {isCrewing: true};

		if(req.body.date && !req.body.date == ''){
			let usDate = helper.switchUsUKDate(req.body.date);
			q1.date = usDate;
			q2.date = usDate; 
			postObj.date = req.body.date;

		}

		if(req.body.airlinecrew && !req.body.airlinecrew == ''){
			q1.customer = req.body.airlinecrew;
			q2.customer = req.body.airlinecrew;
			postObj.customer = req.body.airlinecrew;
		}

		if(req.body.flight && !req.body.flight == ''){
			q1.flight = req.body.flight;
			q2.flight = req.body.flight;
			postObj.flight = req.body.flight;
		}

		let query = q1;

		if(req.body.name && !req.body.name == ''){
			q1['pick_up.instructions'] = new RegExp('^' + req.body.name, 'i');
			q2['drop_off.instructions'] = new RegExp('^' + req.body.name, 'i');
			query = {$or: [q1, q2]};
			postObj.name = req.body.name;
		}

		console.log('QUERY: ', query);

		Booking.find(query)
			.populate('pick_up.locaton')
			.populate('drop_off.locaton')
			.sort({booking_no: -1})
			.limit(50)
			.exec((err, bookings) => {

			if(err){
				return next(err);
			}

			CrewingDefault.find({}, function(err, crewing){

				if(err){
					return next(err);
				}

				console.log(bookings);

				res.render('crewing/search', {
					title: 'Crewing',
					user: user,
					crewing: crewing,
					bookings: bookings,
					postObj: postObj
				});

			});

		});

	});

});

module.exports = crewing;