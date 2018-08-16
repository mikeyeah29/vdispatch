const express = require('express');
const bookingApi = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/user').User;
const Booking = require('../../models/booking').Booking;
const Account = require('../../models/account').Account;
const Locaton = require('../../models/location').Locaton;
const RateSheet = require('../../models/ratesheet').RateSheet;
const VehicleType = require('../../models/vehicle_type').VehicleType;
const CrewingDefault = require('../../models/crewing_default').CrewingDefault;
const mid = require('../../middlewares/index');
const helpful = require('../../helpers/main.js');
const pricing = require('../../helpers/pricing.js');

const routePermission = 'reservations';


function calculatePrice(accountId, pickUp, dropOff, vehicleType, callback){

	Account.findById(accountId)
		.then((account) => {

			if(!account){ 
				callback(new Error('Could Not Find Account ' + accountName), null);	
			}

			Locaton.findById(pickUp).populate('suburb')
				.then((pickUpLoc) => {

					Locaton.findById(dropOff).populate('suburb')
						.then((dropOffLoc) => {

							let puZone = pickUpLoc.suburb.zone;
							let doZone = dropOffLoc.suburb.zone;

							console.log('puZone ', puZone);
							console.log('doZone ', doZone);

							let priceFromRates = false;

							if(puZone == 'C1' || puZone == 'A1' || puZone == 'N4' || puZone == 'N5'){
								priceFromRates = 'Pick Up Zone';
							}

							if(doZone == 'C1' || doZone == 'A1' || doZone == 'N4' || doZone == 'N5'){
								priceFromRates = 'Drop Off Zone';
							}

							if(!priceFromRates){
								return callback(new Error('calculate manually'), null);
							}

							const rateSheet = account.pricing[0].current_ratesheet;

							RateSheet.findOne({name: rateSheet})
								.then((rate) => {

									// console.log('2 in rates ', rate);

									if(!rate){
										return callback(new Error('Account ' + account.name + ' has no rate sheet'), null);
									}

									/*

										Vehicles
										Sedan
										PeopleMover
										Minibus
										Coaster
										Stretch

									*/

									VehicleType.findById(vehicleType)
										.then((vType) => {

											var vTypeName = vType.name.replace(' ', '');

											if(priceFromRates == 'Pick Up Zone'){

												if(puZone == 'A1'){
													puZone = 'C1';
												}

												var vehicleList = rate[puZone].find(function(zone){
													return zone.Zone === doZone;
												});	

												if(!vehicleList){
													return callback(new Error('Zone ' + doZone + ' has no prices in rate sheet, calculate manually'), null);
												}

												if(!vehicleList.hasOwnProperty(vTypeName)){
													return callback(new Error('No price for vehicle type ' + vTypeName), null);
												}

												return callback(null, helpful.dollarStringToInt(vehicleList[vTypeName]));

											}

											if(priceFromRates == 'Drop Off Zone'){

												if(doZone == 'A1'){
													doZone = 'C1';
												}

												var vehicleList = rate[doZone].find(function(zone){
													return zone.Zone === puZone;
												});

												if(!vehicleList){
													return callback(new Error('Zone ' + puZone + ' has no prices in rate sheet, calculate manually'), null);
												}

												if(!vehicleList.hasOwnProperty(vTypeName)){
													return callback(new Error('No price for vehicle type ' + vTypeName), null);
												}

												return callback(null, helpful.dollarStringToInt(vehicleList[vTypeName]));

											}

										})
										.catch((err) => {
											return callback(err, null);
										});

								})
								.catch((err) => {
									console.log('SO were in rates errpr ', err);
									return callback(err, null);
								});

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
			return callback(err, null);
		});
	
}

function calculateCrewingPrice(prices, crew){

	let obj = null;

	// reorder prices by maxcrew
	prices.sort(function(a, b){
	    return a.max_crew-b.max_crew;
	});

	// console.log('Sorted Prices ', prices);

	for(thisPrice of prices){
		if(crew <= thisPrice.max_crew){
			obj = {
				price: thisPrice.price,
				vehicle: thisPrice.vehicle
			};
			break;
		}
	}

	// loop through and find the correct vehicle for the job

	return obj;

}

bookingApi.post('/create-booking', mid.requiresLoginJSON, function(req, res){

	let body = {};

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'User does not have permissions to create a booking';
		res.status(403);
		return res.json(body);
	}

	let price;

	calculatePrice(req.body.customer, req.body.pu_line1, req.body.do_line1, req.body.vehicletype_id, function(err, price){

		if(err){
			body.error = err.message || 'There was a problem calculating the price';
			res.status(err.status || 500);
			return res.json(body);
		}

		//console.log(req.body.date);

		let bookingObj = {
			price: price,
			customer: req.body.customer,
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
		    date: new Date(helpful.dateUsToUk(req.body.date)),
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

		if(req.body.sub_customer) {
			bookingObj.sub_customer = req.body.sub_customer;
		}

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

	CrewingDefault.findById(req.body.customer).populate('hotel').exec(function(err, crewingDef){

		if(err){
			body.error = err.message || 'Some Internal Error';
			res.status(err.status || 500);
			return res.json(body);
		}

		if(!crewingDef.hotel){
			body.error = 'Hotel not set for ' + crewingDef.name + ' <a href="/crewing">Edit Crewing Defaults</a>';
			res.status(200);
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

			Locaton.findOne({line1: 'Cairns Domestic Airport'}).exec(function(err, domestic){

				if(err){
					body.error = err.message || 'Some Internal Error';
					res.status(err.status || 500);
					return res.json(body);
				}

				var locationOne = crewingDef.hotel;
				var locationTwo = domestic._id;
				// work out which vehicle from number of crew

				if(err){
					body.error = err.message || 'Pricing Error';
					res.status(err.status || 500);
					return res.json(body);
				}

				for(let i=0; i<req.body.bookings.length; i++){

					const thisObj = req.body.bookings[i];

					let name;
					let adults = parseInt(thisObj.tech) + parseInt(thisObj.cabin); 
					let pick_up;
					let drop_off;

					if(thisObj.arrival){
						name = thisObj.flight + ' ' + thisObj.tech + ' TECH ' + thisObj.cabin + ' CABIN';
					}else{
						name = thisObj.tech + ' TECH ' + thisObj.cabin + ' CABIN';
					}

					if(thisObj.arrival){
						
						pick_up = { locaton: domestic, instructions: thisObj.crewnames };
						drop_off = { locaton: crewingDef.hotel };

					}else{

						pick_up = { locaton: crewingDef.hotel, instructions: thisObj.crewnames };
					    drop_off = {
							locaton: international // line1: 'Cairns ' + thisObj.flightType + ' Airport'
						};

					}

					let vehicleObj = calculateCrewingPrice(crewingDef.pricing, adults);
					
					if(vehicleObj == null){
						body.error = adults + ' crew members exceeds the max crew for all vehicles';
						res.status(200);
						return res.json(body);
					}

					let bookingObj = new Booking({
						isCrewing: true,
						price: vehicleObj.price,
						customer: crewingDef.account, // thisObj.customer, // account id
					    flight: thisObj.flight,
					    passengers: {
					        name: name,
					        adults: adults
					    },
					    vehicle_type: vehicleObj.vehicle,
					    pick_up: pick_up,
					    drop_off: drop_off,
					    flight: thisObj.flight,
					    transfer_type: 'Private',
					    date: new Date(helpful.dateUsToUk(thisObj.date)),
					    time: thisObj.time
					});

					crewBookingObjs.push(bookingObj.save());

				}

				Promise.all(crewBookingObjs)
					.then((booking) => {

						for(var i=0; i<booking.length; i++){
							booking[i].customer = crewingDef.name;
							booking[i].notes = crewingDef.default_note || '';
						}

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

	});

});

bookingApi.post('/update-booking', mid.requiresLoginJSON, function(req, res){

	let body = {};

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'User does not have permissions to update a booking';
		res.status(403);
		return res.json(body);
	}

	let updateObj = {};

	if(req.body.customer){ //acount id
		updateObj.customer = req.body.customer;
	}

	if(req.body.sub_customer){ // account id
		updateObj.customer = req.body.sub_customer;
	}

	if(req.body.ref1){
		updateObj.reference1 = req.body.ref1;
	}

	if(req.body.ref2){
		updateObj.reference2 = req.body.ref2;
	}

	if(req.body.ref3){
		updateObj.reference3 = req.body.ref3;
	}

	if(req.body.flight){
		updateObj.flight = req.body.flight;
	}

	if(req.body.name){
		if(!updateObj.passengers){ updateObj.passengers = {}; }
		updateObj.passengers.name = req.body.name;
	}

	if(req.body.adults){
		if(!updateObj.passengers){ updateObj.passengers = {}; }
		updateObj.passengers.adults = parseInt(req.body.adults);
	}

	if(req.body.children){
		if(!updateObj.passengers){ updateObj.passengers = {}; }
		updateObj.passengers.children = parseInt(req.body.children);
	}

	if(req.body.infants){
		if(!updateObj.passengers){ updateObj.passengers = {}; }
		updateObj.passengers.infants = parseInt(req.body.infants);
	}

	if(req.body.email){
		if(!updateObj.passengers){ updateObj.passengers = {}; }
		updateObj.passengers.email = req.body.email;
	}

	if(req.body.phone){
		if(!updateObj.passengers){
			updateObj.passengers = {};
		}
		updateObj.passengers.phone = req.body.phone;
	}

	if(req.body.vehicletype_id){
		updateObj.vehicle_type = req.body.vehicletype_id;
	}

	if(req.body.transfer_type){
		updateObj.transfer_type = req.body.transfer_type;	
	}

	if(req.body.pu_line1){
		updateObj.pick_up = {
			locaton: req.body.pu_line1
		}
		if(req.body.pu_instructions){
			updateObj.pick_up.instructions = req.body.pu_instructions;
		}
	}

	if(req.body.do_line1){
		updateObj.drop_off = {
			locaton: req.body.do_line1
		}
		if(req.body.do_instructions){
			updateObj.drop_off.instructions = req.body.do_instructions;
		}
	}

	if(req.body.date){
		updateObj.date = new Date(helpful.dateUsToUk(req.body.date));
	}

	if(req.body.time){
		updateObj.time = req.body.time
	}

	if(req.body.allocation){
		updateObj.allocation = {
			driver: req.body.allocation.driverid,
            vehicle: req.body.allocation.vehicleid
        };
	}

	updateObj.extras = {
		water: 0,
        face_towel: 0,
        rear_seat: 0,
        forward_seat: 0,
        booster: 0
	};

	if(req.body.rear_seat){ updateObj.extras.rear_seat = req.body.rear_seat; }
	if(req.body.forward_seat){ updateObj.extras.forward_seat = req.body.forward_seat }
	if(req.body.booster){ updateObj.extras.booster = req.body.booster }
	if(req.body.water){ updateObj.extras.water = req.body.water }
	if(req.body.face_towel){ updateObj.extras.face_towel = req.body.face_towel }

	updateObj.notes = {
		office: '',
        customer: '',
        driver: ''
	};

	if(req.body.notes_office){ updateObj.notes.office = req.body.notes_office }
	if(req.body.notes_customer){ updateObj.notes.customer = req.body.notes_customer }
	if(req.body.notes_driver){ updateObj.notes.driver = req.body.notes_driver }

	if(req.body.price){
		updateObj.price = req.body.price;
	}

	// Booking.findById(req.body.bookingid, (err, booking) => {

	// 	if(err){
	// 		body.error = err.message || 'Some Internal Error';
	// 		res.status(err.status || 500);
	// 		return res.json(body);
	// 	}

	// 	if(booking.isCrewing){

	// 		CrewingDefault.findById(req.body.crewingid).populate('hotel').exec(function(err, crewingDef){

	// 			if(err){
	// 				body.error = err.message || 'Some Internal Error';
	// 				res.status(err.status || 500);
	// 				return res.json(body);
	// 			}

	// 			if(!crewingDef.hotel){
	// 				body.error = 'Hotel not set for ' + crewingDef.name + ' <a href="/crewing">Edit Crewing Defaults</a>';
	// 				res.status(200);
	// 				return res.json(body);
	// 			}

	// 			// crewingDefs
	// 			let vehicleObj = calculateCrewingPrice(crewingDef.pricing, updateObj.passengers.adults);

	// 			updateObj.price = price;

	// 			booking.update(updateObj)
	// 				.then((result) => {
	// 					console.log('rresult ', result);
	// 					body.success = 'Booking Updated';
	// 					res.status(200);
	// 					return res.json(body);
	// 				})
	// 				.catch((e) => {
	// 					body.error = err.message || 'There was a problem calculating the price';
	// 					res.status(err.status || 500);
	// 					return res.json(body);
	// 				});

	// 		});

	// 	}else{

	// 		calculatePrice(req.body.customer, req.body.pu_line1, req.body.do_line1, req.body.vehicletype_id, function(err, price){

	// 			if(err){
	// 				body.error = err.message || 'There was a problem calculating the price';
	// 				res.status(err.status || 500);
	// 				return res.json(body);
	// 			}

	// 			// update

	// 			updateObj.price = price;

	// 			booking.update(updateObj)
	// 				.then((result) => {
	// 					console.log('rresult ', result);
	// 					body.success = 'Booking Updated';
	// 					res.status(200);
	// 					return res.json(body);
	// 				})
	// 				.catch((e) => {
	// 					body.error = err.message || 'There was a problem calculating the price';
	// 					res.status(err.status || 500);
	// 					return res.json(body);
	// 				});

	// 		});

	// 	}

	// });

	Booking.update({_id: req.body.bookingid}, {
		$set: updateObj
	}, (err, booking) => {

		if(err){
			body.error = err.message || 'Some Internal Error';
			res.status(err.status || 500);
			return res.json(body);
		}

		body.success = 'Booking Updated';
		res.status(200);
		return res.json(body);

	});

});

module.exports = bookingApi;

// /POST /create-booking

// /DELETE /delete_booking

// GET /search/:query