'use strict';

const express = require('express');
const api = express.Router();
const User = require('../models/user.js').User;
const Suburb = require('../models/suburb.js').Suburb;

api.post('/suburbs', function(req, res, next){

	var phrase = req.body.phrase;
	var regex = new RegExp(phrase, 'i');

	Suburb.find({"suburb": regex}).exec(function(err, suburbs){

		if(err){
			return res.send(err);
		}

		return res.send(suburbs);

	});

});

api.post('/postcodes', function(req, res, next){

	var phrase = req.body.phrase;
	var regex = new RegExp(phrase, 'i');

	Suburb.find({"postcode": regex}).distinct('postcode').exec(function(err, postcodes){

		console.log(postcodes);

		if(err){
			return res.send(err);
		}

		return res.send(postcodes);

	});

});

module.exports = api;