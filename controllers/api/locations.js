'use strict';

const express = require('express');
const locationApi = express.Router();
const User = require('../../models/user.js').User;
const Locaton = require('../../models/location.js').Locaton;
const helper = require('../../helpers/main.js');
const mid = require('../../middlewares/index');

const routePermission = 'reservations';

// /crewing

locationApi.post('/add', mid.requiresLoginJSON, function(req, res){

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'User does not have permissions to add locations';
		res.status(403);
		return res.json(body);
	}

	let body = {};

	if(!req.body.line1 || !req.body.suburbId){
		body.error = 'Invalid Data';
		res.status(400);
		return res.json(body);
	}

	console.log('req ', req.body);

	let location = new Locaton({
		line1: req.body.line1,
        line2: req.body.line2 || '',
        suburb: req.body.suburbId
	});

	location.save()
		.then((location) => {

			body.location = location;
			body.success = 'Locaton Saved';
			res.status(200);
			return res.json(body);

		})
		.catch((err) => {

			if(err.code == 11000){
				body.error = 'Theres allready a location called ' + req.body.line1;
				res.status(409);
			}else{
				body.error = err || 'Internal Server Error';
				res.status(err.status || 500);
			}

			return res.json(body);

		});

});

locationApi.post('/update', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'User does not have permissions to update locations';
		res.status(403);
		return res.json(body);
	}

	let body = {};

	console.log('resa ', req.body);

	if(!req.body.line1 || !req.body.line2, !req.body.suburbId){
		body.error = 'Invalid Data';
		res.status(400);
		return res.json(body);
	}

	Locaton.update(
			{
				_id: req.body.updateId
			},
			{
				$set: {
					line1: req.body.line1, 
					line2: req.body.line2,
					suburb: req.body.suburbId
				}
			}
		)
		.then((numAffected) => {

			body.numAffected = numAffected;
			body.success = 'Updated';
			res.status(200);
			return res.json(body);
		
		})
		.catch((err) => {

			if(err.code == 11000){
				body.error = 'Theres allready a location called ' + req.body.line1;
				res.status(409);
			}else{
				body.error = err || 'Internal Server Error';
				res.status(err.status || 500);
			}

			return res.json(body);

		});

});

locationApi.post('/search', function(req, res, next){

	var phrase = req.body.phrase;
	var regex = new RegExp(phrase, 'i');

	Locaton.find({"line1": regex}).populate('suburb').limit(30).exec(function(err, locations){

		if(err){
			return res.send(err);
		}

		return res.send(locations);

	});

});

locationApi.delete('/:locationId', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'User does not have permissions to delete locations';
		res.status(403);
		return res.json(body);
	}

	let body = {};

	Locaton.remove({_id: req.params.locationId}, (err, removed) => {

		if(err){
			console.log(err);
			body.error = err || 'Internal Server Error';
			res.status(err.status || 500);
			return res.json(body);
		}

		body.removed = removed;
		body.success = 'Location Removed';
		res.status(200);
		return res.json(body);

	});

});

module.exports = locationApi;