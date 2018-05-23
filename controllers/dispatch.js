'use strict';

const express = require('express');
const dispatch = express.Router();
const User = require('../models/user.js').User;
const Booking = require('../models/booking.js').Booking;
const mid = require('../middlewares/index');

const routePermission = 'operations';

dispatch.get('/', mid.requiresLogin, function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId, function(err, user){

		if(err){
			return next(err);
		}

		Booking.find({}).sort({booking_no: -1}).limit(30).exec(function(err, bookings){

			if(err){
				return next(err);
			}

			res.render('dispatch', {
				title: 'Dispatch',
				user: user,
				bookings: bookings
			});

		});

	});

});	

module.exports = dispatch;