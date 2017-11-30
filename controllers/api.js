'use strict';

const express = require('express');
const api = express.Router();
const User = require('../models/user.js').User;
const Suburb = require('../models/suburb.js').Suburb;
const Locaton = require('../models/location.js').Locaton;
const Account = require('../models/account.js').Account;
const VehicleType = require('../models/vehicle_type.js').VehicleType;

api.post('/suburbs', function(req, res, next){

	var phrase = req.body.phrase;
	var regex = new RegExp(phrase, 'i');

	console.log('phrase ', phrase);

	Suburb.find({"suburb": regex}).exec(function(err, suburbs){

		if(err){
			return res.send(err);
		}

		console.log('suburbs ', suburbs);

		return res.send(suburbs);

	});

});

api.post('/postcodes', function(req, res, next){

	var phrase = req.body.phrase;
	var regex = new RegExp(phrase, 'i');

	Suburb.find({"postcode": regex}).distinct('postcode').exec(function(err, postcodes){

		if(err){
			return res.send(err);
		}

		return res.send(postcodes);

	});

});

api.post('/vehicletypes', function(req, res, next){

	let body = {};

	VehicleType.find({}).exec(function(err, vehicle_types){

		if(err){
			body.error = err;
			return res.json(body);
		}

		body.vehicles = vehicle_types;
		return res.json(body);

	});

});

api.post('/accounts', function(req, res, next){

	let body = {};

	let queryObj = {status: true};

	if(req.body.account_category){
		queryObj.account_category = req.body.account_category;
	}

	if(req.body.exclude && Array.isArray(req.body.exclude)){
		queryObj._id = { $nin: req.body.exclude };
	}	

	Account.find(queryObj, function(err, accounts){

		if(err){
			body.error = err;
			return res.json(body);
		}

		body.accounts = accounts;
		return res.json(body);

	});

});

module.exports = api;