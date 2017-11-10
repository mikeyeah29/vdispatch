'use strict';

const express = require('express');
const crewingApi = express.Router();
const User = require('../../models/user.js').User;
const Account = require('../../models/account.js').Account;
const Booking = require('../../models/booking.js').Booking;
const Locaton = require('../../models/location.js').Locaton;
const VehicleType = require('../../models/vehicle_type').VehicleType;
const CrewingDefault = require('../../models/crewing_default').CrewingDefault;
const helper = require('../../helpers/main.js');
const mid = require('../../middlewares/index');

const routePermission = 'reservations';

// /crewing

crewingApi.get('/:crewingId', mid.requiresLoginJSON, function(req, res){

	let body = {};

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'User does not have permissions to create crewing defaults';
		res.status(403);
		return res.json(body);
	}

	CrewingDefault.findById(req.params.crewingId, function(err, crewingDefault){

		if(err){
			body.error = err.message || 'Intenal Server Error';
			res.status(err.status || 500);
			return res.json(body);
		}

		body.crewing = crewingDefault;
		res.status(200);
		return res.json(body);

	});

});

crewingApi.post('/create', mid.requiresLoginJSON, function(req, res){

	let body = {};

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'User does not have permissions to create crewing defaults';
		res.status(403);
		return res.json(body);
	}

	CrewingDefault.create({ account: req.body.account, name: req.body.name }, function(err, crewDef){
		
		if(err){
			body.error = err.message || 'Intenal Server Error';
			res.status(err.status || 500);
			return res.json(body);
		}

		CrewingDefault.find({}, function(err, crewing){

			if(err){
				body.error = err.message || 'Intenal Server Error';
				res.status(err.status || 500);
				return res.json(body);
			}

			body.success = 'Crewing Default Set';
			body.crewing = crewing;
			res.status(200);
			return res.json(body);
		});

	});

});

crewingApi.post('/update-hotel', mid.requiresLoginJSON, function(req, res){

	let body = {};

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'User does not have permissions to update crewing defaults';
		res.status(403);
		return res.json(body);
	}

	if(!req.body.crewing_id || !req.body.location){
		body.error = 'Invalid Data';
		res.status(400);
		return res.json(body);
	}

	CrewingDefault.update({_id: req.body.crewing_id}, {
		hotel: {
			location: req.body.location,
            line2: req.body.line2 || '',
            suburb: req.body.suburb || '',
            zone: req.body.zone || ''
		}
	}, function(err, crewDef){

		if(err){
			body.error = err.message || 'Intenal Server Error';
			res.status(err.status || 500);
			return res.json(body);
		}

		CrewingDefault.find({}, function(err, crewing){

			if(err){
				body.error = err.message || 'Intenal Server Error';
				res.status(err.status || 500);
				return res.json(body);
			}

			body.success = 'Hotel Updated';
			body.crewing = crewing;
			res.status(200);
			return res.json(body);

		});

	});

});

crewingApi.post('/update-prices', mid.requiresLoginJSON, function(req, res){

	let body = {};
	let prices = req.body.prices;

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'User does not have permissions to update crewing defaults';
		res.status(403);
		return res.json(body);
	}

	if(!Array.isArray(prices) && prices != 'empty'){
		res.status(400);
		body.error = 'Prices Required';
		return res.json(body);
	}

	if(prices != 'empty'){
		for(let i=0; i<prices.length; i++){
			if(!prices[i].vehicle || !prices[i].max_crew || !prices[i].price){
				res.status(400);
				body.error = 'Prices Object Incorrectly Formatted';
				return res.json(body);
			}
		}
	}

	let updateObj = {};

	if(prices != 'empty'){
		updateObj.pricing = req.body.prices;
	}else{
		updateObj = {
			$set: {
				pricing: []
			}
		}
	}

	CrewingDefault.update({_id: req.body.crewing_id}, updateObj, function(err, crewDef){
		if(err){
			body.error = err.message || 'Intenal Server Error';
			res.status(err.status || 500);
			return res.json(body);
		}

		CrewingDefault.find({}, function(err, crewing){

			if(err){
				body.error = err.message || 'Intenal Server Error';
				res.status(err.status || 500);
				return res.json(body);
			}

			body.success = 'Prices Updated';
			body.crewing = crewing;
			res.status(200);
			return res.json(body);

		});

	});	

});

crewingApi.post('/update-notes', mid.requiresLoginJSON, function(req, res){

	let body = {};

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'User does not have permissions to update crewing defaults';
		res.status(403);
		return res.json(body);
	}

	CrewingDefault.update({_id: req.body.crewing_id}, {
		default_note: req.body.note
	}, function(err, crewDef){

		if(err){
			body.error = err.message || 'Intenal Server Error';
			res.status(err.status || 500);
			return res.json(body);
		}

		CrewingDefault.find({}, function(err, crewing){

			if(err){
				body.error = err.message || 'Intenal Server Error';
				res.status(err.status || 500);
				return res.json(body);
			}

			body.success = 'Notes Updated';
			body.crewing = crewing;
			res.status(200);
			return res.json(body);

		});

	});	

});

module.exports = crewingApi;

