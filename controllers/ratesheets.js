'use strict';

const express = require('express');
const rates = express.Router();
const User = require('../models/user.js').User;
const RateSheet = require('../models/ratesheet.js').RateSheet;
const moment = require('moment');

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

			RateSheet.find({})
				.sort({created_at: -1})
				.select({name: 1, ratecode: 1, discount_percent: 1, valid_from: 1, valid_to: 1})
				.limit(30).exec(function(err, rates){

				if(err){
					return next(err);
				}

				rates.forEach(function(rate){
					rate.from = moment(rate.valid_from).format('DD/MM/YYYY');
					rate.to = moment(rate.valid_to).format('DD/MM/YYYY');
				});

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

	let error = '';

	User.findById(req.session.userId).exec(function(err, user){

		if(err){ return next(err); }

		if(req.body.term){

			RateSheet.find({name: new RegExp(req.body.term, 'i')})
			.limit(30)
			.exec((err, rates) => {

				if(err){
					return next(err);
				}

				return res.render('ratesheets/ratesheets', {
					title: 'All Ratesheets',
					user: user,
					rates: rates,
					error: error,
					rs: 'none',
					search: 'Search results for ' + req.body.term
				});

			});

		}else{

			if(!req.files){
				error = 'No file uploaded';
			}

			var ext = req.files.ratesheet.name.substr(req.files.ratesheet.name.lastIndexOf('.') + 1);

			if(ext != 'csv'){
				error = 'Unsupported file type, must be csv';

				RateSheet.find()
					.sort({created_at: -1})
					.select({
						name: 1, 
						ratecode: 1, 
						discount_percent: 1, 
						valid_from: 1, 
						valid_to: 1
					}).limit(30).exec(function(err, rates){

						if(err){ return next(err); }

						rates.forEach(function(rate){
							rate.from = moment(rate.valid_from).format('DD/MM/YYYY');
							rate.to = moment(rate.valid_to).format('DD/MM/YYYY');
						});

						return res.render('ratesheets/ratesheets', {
							title: 'All Ratesheets',
							user: user,
							rates: rates,
							error: error,
							rs: 'none'
						});

				});

			}else{

				var cols = ['Zone', 'Suburb', 'Sedan', 'PeopleMover', 'Minibus', 'Coaster', 'Stretch'];
				csv.parse(req.files.ratesheet.data, {columns: cols}, function(err, rs){

					if(err){

						error = err;

						RateSheet.find()
							.sort({created_at: -1})
							.select({
								name: 1, 
								ratecode: 1, 
								discount_percent: 1, 
								valid_from: 1, 
								valid_to: 1
							}).limit(30).exec(function(err, rates){

								if(err){ return next(err); }

								rates.forEach(function(rate){
									rate.from = moment(rate.valid_from).format('DD/MM/YYYY');
									rate.to = moment(rate.valid_to).format('DD/MM/YYYY');
								});

								return res.render('ratesheets/ratesheets', {
									title: 'All Ratesheets',
									user: user,
									rates: rates,
									error: error,
									rs: rs
								});

						});

					}else{

						RateSheet.createRateSheetWithCsv(rs, function(err, rates){

							let success = '';

							console.log('njknjk');

							if(err){ 
								error = err; 
							}else{
								success = 'Rate Sheet Created';
							}

							rates.forEach(function(rate){
								rate.from = moment(rate.valid_from).format('DD/MM/YYYY');
								rate.to = moment(rate.valid_to).format('DD/MM/YYYY');
							});

							return res.render('ratesheets/ratesheets', {
								title: 'All Ratesheets',
								user: user,
								rates: rates,
								error: error,
								success: success,
								rs: rs
							});

						});

					}

				});

			}

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

					// var valid_from = moment(rate.valid_from).format("MMM Do YY");
					// var valid_to = moment(rate.valid_to).format("MMM Do YY");

					res.render('ratesheets/update_ratesheet', {
						title: 'Update Ratesheet',
						user: user,
						rate: rate,
						valid_from: moment(rate.valid_from).format("MMM Do YY"),
						valid_to: moment(rate.valid_to).format("MMM Do YY")
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