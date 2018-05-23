'use strict';

const express = require('express');
const bookings = express.Router();
const User = require('../models/user.js').User;
const Account = require('../models/account.js').Account;
const Booking = require('../models/booking.js').Booking;
const Locaton = require('../models/location.js').Locaton;
const VehicleType = require('../models/vehicle_type').VehicleType;
const helper = require('../helpers/main.js');
const pagination = require('../helpers/pagination.js');
const mid = require('../middlewares/index');

const routePermission = 'reservations';

// /booking

bookings.get('/', mid.requiresLogin, function(req, res){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}
	
	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}
		
		Account.find({status: true}).select({name: true}).exec(function(err, customers){

			if(err){
				return next(err);
			}

			VehicleType.find({status: true}, function(err, vTypes){

				if(err){
					return next(err);
				}

				res.render('bookings/booking', {
					title: 'Booking',
					mode: 'add',
					user: user,
					customers: customers,
					vehicleTypes: vTypes
				});

			});

		});

	});

});

bookings.get('/edit/:bookingid', mid.requiresLogin, function(req, res){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}
		
		Account.find({status: true}).select({name: true}).exec(function(err, customers){

			if(err){
				return next(err);
			}

			VehicleType.find({status: true}, function(err, vTypes){

				if(err){
					return next(err);
				}

				Booking.findById(req.params.bookingid)
					.populate('vehicle_type')
					.populate('pick_up.locaton')
					.populate('drop_off.locaton')
					.exec((err, booking) => {

					if(err){
						return next(err);
					}

					console.log(booking);

					res.render('bookings/edit', {
						title: 'Booking',
						edit: true,
						user: user,
						customers: customers,
						vehicleTypes: vTypes,
						booking: booking
					});

				});

			});

		});

	});

});

bookings.get('/view/:bookingid', mid.requiresLogin, function(req, res){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId, (err, user) => {

		if(err){
			return next(err);
		}

		Booking.findById(req.params.bookingid, (err, booking) => {

			if(err){
				return next(err);
			}

			res.render('bookings/view', {
				title: 'Booking',
				edit: true,
				user: user,
				booking: booking
			});

		});

	});

});

bookings.get('/locations', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	const docsPerPage = 50;

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		Locaton.find({})
			.limit(docsPerPage)
			.skip(pagination.getSkip(req.query.page, docsPerPage))
			.populate('suburb').exec(function(err, locations){

			Locaton.count().exec((err, count) => {

				res.render('locations', {
					title: 'Locations',
					locations: locations,
					user: user,
					paginationLinks: pagination.getLinks(count, docsPerPage, req.query.page)
				});

			});

		});

	});

});

// /search

module.exports = bookings;