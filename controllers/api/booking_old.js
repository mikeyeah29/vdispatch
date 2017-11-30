const express = require('express');
const bookingApi = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/user').User;
const Booking = require('../../models/booking').Booking;
const Account = require('../../models/account').Account;
const Locaton = require('../../models/location').Locaton;
const RateSheet = require('../../models/ratesheet').RateSheet;
const CrewingDefault = require('../../models/crewing_default').CrewingDefault;
const mid = require('../../middlewares/index');
const helpful = require('../../helpers/main.js');
const pricing = require('../../helpers/pricing.js');

const routePermission = 'reservations';


function calculatePrice(accountName, pickUp, dropOff, callback){

	Account.findOne({name: accountName})
		.then((account) => {

			console.log('1 in account');

			if(!account){ 
				callback(new Error('Could Not Find Account ' + accountName), null);	
			}

			const rateSheet = account.pricing[0].current_ratesheet; // name
			
			RateSheet.findOne({name: rateSheet})
				.then((rate) => {

					console.log('2 in rates');

					if(!rate){
						return callback(new Error('Account ' + accountName + ' has no rate sheet'), null);
					}

					Locaton.findById(pickUp).populate('suburb')
						.then((pickUpLoc) => {

							console.log('3 in locations');

							Locaton.findById(dropOff).populate('suburb')
								.then((dropOffLoc) => {

									console.log('4 in nextlocatopn');

									const puZone = pickUpLoc.suburb.zone;
									const doZone = dropOffLoc.suburb.zone;

									console.log('pickUpLoc ', pickUpLoc);
									console.log('dropOffLoc ', dropOffLoc);
									console.log('puZone ', puZone);
									console.log('doZone ', doZone);

									let priceFromRates = false;

									if(puZone == 'C1' || puZone == 'N4' || puZone == 'N5'){
										priceFromRates = 'Pick Up Zone';
									}

									if(doZone == 'C1' || doZone == 'N4' || doZone == 'N5'){
										priceFromRates = 'Drop Off Zone';
									}

									if(!priceFromRates){
										return callback(new Error('calculate manually'), null);
									}

									if(priceFromRates == 'Pick Up Zone'){

										var thePrice = rate[puZone].find(function(zone){
											return zone.Zone === 'A1';
										});	

										console.log('PROCE ', thePrice);

										return callback(null, thePrice['Sedan']);

									}

									if(priceFromRates == 'Drop Off Zone'){

										var thePrice = rate[doZone].find(function(zone){
											return zone.Zone === puZone;
										});	

										return callback(null, thePrice['Sedan']);
									}

								})
								.catch((err) => {
									return callback(err, null);
								});

						})
						.catch((err) => {
							return callback(err, null);
						});

				})
				.catch((err) => {
					console.log('SO were in rates errpr ', err);
					return callback(err, null);
				});

			// Rate.getPrice();

		})
		.catch((err) => {
			return callback(err, null);
		});
	
}



bookingApi.post('/create-booking', mid.requiresLoginJSON, function(req, res){

	let body = {};

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'User does not have permissions to create a booking';
		res.status(403);
		return res.json(body);
	}

	let price;

	calculatePrice(req.body.customer, req.body.pu_line1, req.body.do_line1, function(err, price){

		console.log(err);

		if(err){
			body.error = err.message || 'There was a problem calculating the price';
			res.status(err.status || 500);
			return res.json(body);
		}

		console.log('Price: ', price);

		let bookingObj = {
			price: price,
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
		        locaton: req.body.pu_line1
		    },
		    drop_off: {
		        locaton: req.body.do_line1
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

		let internationalAirport;
		let domesticAirport;

		Locaton.findOne({line1: 'Cairns International Airport'}).exec(function(err, international){

			if(err){
				body.error = err.message || 'Some Internal Error';
				res.status(err.status || 500);
				return res.json(body);
			}

			// console.log('International ', international);

			Locaton.findOne({line1: 'Cairns Domestic Airport'}).exec(function(err, domestic){

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
						
						pick_up = { locaton: domestic };
						drop_off = { locaton: crewingDef.hotel };

					}else{

						pick_up = { locaton: crewingDef.hotel };
					    drop_off = {
							locaton: international // line1: 'Cairns ' + thisObj.flightType + ' Airport'
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

			});

		});

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