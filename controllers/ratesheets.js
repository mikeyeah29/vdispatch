'use strict';

const express = require('express');
const rates = express.Router();
const User = require('../models/user.js').User;
const RateSheet = require('../models/ratesheet.js').RateSheet;

var csv = require('csv');

const routePermission = 'administrator';

rates.get('/', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}else{

			RateSheet.find().select({name: 1, ratecode: 1, discount_percent: 1}).limit(30).exec(function(err, rates){

				if(err){
					return next(err);
				}

				console.log('Rates: ', rates);

				res.render('ratesheets/ratesheets', {
					title: 'All Ratesheets',
					user: user,
					rates: rates
				});

			});

		}

	});

});

rates.post('/', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}else{

			if(!req.files){

				return res.render('ratesheets/ratesheets', {
					title: 'All Ratesheets',
					user: user,
					rates: [],
					error: 'No file uploaded',
					rs: 'none'
				});

			}

			var cols = ['Zone', 'Suburb', 'Sedan', 'PeopleMover', 'Minibus', 'Coaster', 'Stretch'];

			csv.parse(req.files.ratesheet.data, {columns: cols}, function(err, rs){

				if(err){
					return next(err);
				}

				RateSheet.createRateSheetWithCsv(rs, function(err, rates){

					var error = '';

					if(err){
						error = 'There is allready a ratesheet with that that name, edit csv and try again';
					}

					res.render('ratesheets/ratesheets', {
						title: 'All Ratesheets',
						user: user,
						rates: rates,
						rs: rs,
						error: error,
						success: 'Rate Sheet Created'
					});

				});

			});

		}

	});	

});

rates.get('/update/:rateSheetId', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	const rateId = req.params.rateSheetId;

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}else{

			RateSheet.findById(rateId).exec(function(err, rate){

				if(err){
					return next(err);
				}else{

					res.render('ratesheets/update_ratesheet', {
						title: 'Update Ratesheet',
						user: user,
						rate: rate
					});

				}

			});

		}

	});

});

rates.post('/update', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}else{

			if(!req.files){

				return res.render('ratesheets/update_ratesheet', {
					error: 'No file uploaded',
					title: 'Update Ratesheet',
					user: user,
					rate: 'none'
				});

			}

			var cols = ['Zone', 'Suburb', 'Sedan', 'PeopleMover', 'Minibus', 'Coaster', 'Stretch'];

			csv.parse(req.files.ratesheet.data, {columns: cols}, function(err, rs){

				if(err){
					return next(err);
				}

				RateSheet.updateRateSheetWithCsv(rs, req.body.ratesheetid, function(err, rate){

					var error = '';
					var success = '';

					if(err){
						error = 'There is allready a ratesheet with that that name, edit csv and try again';
					}else{
						success = 'Rate Sheet Updated';
					}

					res.render('ratesheets/update_ratesheet', {
						error: error,
						title: 'Update Ratesheet',
						user: user,
						rate: rate,
						success: success
					});

				});

			});

		}

	});

});


module.exports = rates;