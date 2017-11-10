const express = require('express');
const bookingApi = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/user').User;
const Booking = require('../../models/booking').Booking;
const CrewingDefault = require('../../models/crewing_default').CrewingDefault;
const mid = require('../../middlewares/index');
const helpful = require('../../helpers/main.js');

const routePermission = 'reservations';

bookingApi.post('/create-booking', mid.requiresLoginJSON, function(req, res){

	let body = {};

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'User does not have permissions to create a booking';
		res.status(403);
		return res.json(body);
	}

	let bookingObj = {
		customer: req.body.customer,
	    sub_customer: req.body.sub_customer,
	    reference1: req.body.ref1,
	    reference2: req.body.ref2,
	    reference3: req.body.ref3,
	    passengers: {
	        name: req.body.name,
	        adults: req.body.adults,
	        children: req.body.children,
	        infants: req.body.infants,
	        email: req.body.email,
	        phone: req.body.phone
	    },
	    vehicle_type: req.body.vehicletype_id,
	    pick_up: {
	        line1: req.body.pu_line1,
	        line2: req.body.pu_line2,
	        suburb: req.body.pu_suburb,
	        postcode: req.body.pu_postcode
	    },
	    drop_off: {
	        line1: req.body.do_line1,
	        line2: req.body.do_line2,
	        suburb: req.body.do_suburb,
	        postcode: req.body.do_postcode
	    },
	    transfer_type: req.body.transfer_type,
	    flight: req.body.flight,
	    date: new Date(req.body.date).getDate(),
	    time: req.body.time,
	    extras: {
	        water: req.body.water || 0,
	        face_towel: req.body.face_towel || 0,
	        rear_seat: req.body.rear_seat || 0,
	        forward_seat: req.body.forward_seat || 0,
	        booster: req.body.booster || 0
	    },
	    notes: {
	        office: req.body.notes_office || '',
	        customer: req.body.notes_customer || '',
	        driver: req.body.notes_driver || ''
	    }
	};

	Booking.create(bookingObj, function(err, booking){

		if(err){
			// console.log('yep its this error ', err.message);
			body.error = err.message || 'Some Internal Error';
			res.status(err.status || 500);
			return res.json(body);
		}

		body.success = 'Booking Created';
		body.booking = booking;
		res.status(200);
		return res.json(body);

	});

});

bookingApi.post('/crewing-booking', mid.requiresLoginJSON, function(req, res){

	let body = {};

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'User does not have permissions to create a booking';
		res.status(403);
		return res.json(body);
	}

	let crewBookingObjs = [];

	CrewingDefault.findById(req.body.customer, function(err, crewingDef){

		if(err){
			body.error = err.message || 'Some Internal Error';
			res.status(err.status || 500);
			return res.json(body);
		}

		for(let i=0; i<req.body.bookings.length; i++){

			const thisObj = req.body.bookings[i];

			let name;
			let adults = thisObj.tech + thisObj.cabin; 
			let pick_up;
			let drop_off;

			if(thisObj.arrival){
				name = thisObj.flight + ' ' + thisObj.tech + ' TECH ' + thisObj.cabin + ' CABIN';
			}else{
				name = thisObj.tech + ' TECH ' + thisObj.cabin + ' CABIN';
			}

			if(thisObj.arrival){
				
				pick_up = {
					line1: 'Cairns ' + thisObj.flightType + ' Airport'
				};
			
				drop_off = {
					line1: crewingDef.hotel.location,
			        line2: crewingDef.hotel.line2,
			        suburb: crewingDef.hotel.suburb,
			        zone: crewingDef.hotel.zone
				};

			}else{

				pick_up = {
			        line1: crewingDef.hotel.location,
			        line2: crewingDef.hotel.line2,
			        suburb: crewingDef.hotel.suburb,
			        zone: crewingDef.hotel.zone
			    };

			    drop_off = {
					line1: 'Cairns ' + thisObj.flightType + ' Airport'
				};

			}

			let bookingObj = new Booking({
				customer: thisObj.customer,
			    reference1: thisObj.flight,
			    passengers: {
			        name: name,
			        adults: adults
			    },
			    // vehicle_type: ,
			    pick_up: pick_up,
			    drop_off: drop_off,
			    flight: thisObj.flight,
			    date: new Date(thisObj.date).getDate(),
			    time: thisObj.time
			});	

			crewBookingObjs.push(bookingObj.save());

		}

		// save 

		Promise.all(crewBookingObjs)
			.then((booking) => {

				body.success = 'Booking Created';
				body.booking = booking;
				res.status(200);
				return res.json(body);

			})
			.catch((err) => {

				if(err){
					body.error = err.message || 'Some Internal Error';
					res.status(err.status || 500);
					return res.json(body);
				}

			});

	});

});

module.exports = bookingApi;

// /POST /create-booking

// /DELETE /delete_booking

// GET /search/:query