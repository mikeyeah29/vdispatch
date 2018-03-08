'use strict';

const express = require('express');
const vehicles = express.Router();
const User = require('../models/user.js').User;
const Vehicle = require('../models/vehicle.js').Vehicle;
const VehicleType = require('../models/vehicle_type.js').VehicleType;
const mid = require('../middlewares/index');
const helpful = require('../helpers/main');
const moment = require('moment');

const routePermission = 'management';

vehicles.get('/overview', mid.requiresLogin, function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		Vehicle.find({status: true}, function(err, vehicles){

			if(err){
				return next(err);
			}

			for(var i=0; i<vehicles.length; i++){
				vehicles[i].rego_formatted = moment(vehicles[i].rego_expiry).format('DD/MM/YYYY');
				vehicles[i].coi_formatted = moment(vehicles[i].coi_expiry).format('DD/MM/YYYY');
				if(vehicles[i].dot_booking){
					vehicles[i].dot_formatted = moment(vehicles[i].dot_booking).format('DD/MM/YYYY');
				}else{
					vehicles[i].dot_formatted = '-';
				}
			}

			return res.render('vehicles/overview', {
				user: user,
				vehicles: vehicles,
				vehiclesByRegExp: Vehicle.soonExpiring(vehicles.slice(0), 'rego_expiry'),
				vehiclesByCoiExp: Vehicle.soonExpiring(vehicles.slice(0), 'coi_expiry'),
				vehiclesByDot: Vehicle.soonExpiring(vehicles.slice(0), 'dot_booking'),
				title: 'Vehicles Overview'
			});

		});

	});

});

vehicles.get('/', mid.requiresLogin, function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		Vehicle.find({}).sort({created_at: -1}).populate('type').exec(function(err, vehicles){

			if(err){
				next(err);
			}

			return res.render('vehicles/vehicles', {
				title: 'Vehicles',
				user: user,
				vehicles: vehicles
			});

		});

	});

});

vehicles.get('/types', mid.requiresLogin, function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		VehicleType.find({}, function(err, vehicleTypes){

			if(err){
				return next(err);
			}

			return res.render('vehicles/types', {
				user: user,
				title: 'Vehicle Types',
				vehicleTypes: vehicleTypes
			});

		});

	});

});

vehicles.get('/types/create-type', mid.requiresLogin, function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		return res.render('vehicles/create_type', {
			user: user,
			title: 'Create Vehicle Types'
		});

	});

});

vehicles.post('/types/create-type', mid.requiresLoginJSON, function(req, res, next){

	let body = {};

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'unauthorised';
		res.status(403);
		return res.send(body);
	}

	let vTypeObj = {
		name: req.body.name,
        code: req.body.code,
        type: {
            make: req.body.type.make,
            model: req.body.type.model
        },
        features: {
            seats: req.body.features.seats,
            suitcases: req.body.features.suitcases,
            carry_on: req.body.features.carry_on,
            image: req.body.features.image || ''
        },
        details: {
            service_km: req.body.details.service_km,
            fuel_type: req.body.details.fuel_type
        },
        status: req.body.status
	};

	VehicleType.create(vTypeObj, function(err, vType){

		if(err){
			if(err.code == 11000){
				res.status(409);
				body.error = 'A vehicle type with the name ' + req.body.name + ' already exists';
				return res.send(body);
			}
			res.status(err.status || 500);
			body.error = err.message;
			return res.send(body);
		}

		body.vehicletype = vType;
		return res.send(body);

	});

});

vehicles.get('/types/edit/:typeId', mid.requiresLogin, function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		VehicleType.findById(req.params.typeId, function(err, vehicleType){

			if(err){
				return next(err);
			}

			return res.render('vehicles/edit_type', {
				user: user,
				title: 'Update Vehicle Type',
				vehicleType: vehicleType
			});

		});

	});

});

vehicles.post('/types/update', mid.requiresLoginJSON, function(req, res, next){

	let body = {};

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'you do not have permission to update vehicle types';
		res.status(403);
		return res.send(body);
	}

	if(!req.body.name){
		body.error = 'No name specified';
		res.status(400);
		return res.send(body);
	}

	VehicleType.update({_id: req.body.vehicleTypeId}, 
		{
			$set: {
				name: req.body.name,
	            code: req.body.code,
	            type: {
	                make: req.body.type.make,
	                model: req.body.type.model
	            },
	            features: {
	                seats: req.body.features.seats,
	                suitcases: req.body.features.suitcases,
	                carry_on: req.body.features.carry_on,
	                image: req.body.features.image || ''
	            },
	            details: {
	                service_km: req.body.details.service_km,
	                fuel_type: req.body.details.fuel_type
	            },
	            status: req.body.status
			}
		},
		function(err, results){

			if(err){
				res.status(err.status || 500);
				body.error = err.message;
				return res.send(body);
			}	

			if(results.n < 1){
				res.status(500);
				body.error = 'Something has gone wrong';
				return res.send(body);
			}

			VehicleType.findById(req.body.vehicleTypeId, function(err, vehicleType){

				if(err){
					res.status(err.status || 500);
					body.error = err.message;
					return res.send(body);
				}

				body.vehicletype = vehicleType;
				res.status(200);
				return res.send(body);

			});

		}
	);

});

vehicles.post('/types/update-status', mid.requiresLoginJSON, function(req, res, next){

	let body = {};

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'you do not have permission to update vehicle types';
		res.status(403);
		return res.send(body);
	}

	if(req.body.status == null || req.body.status == undefined || !req.body.vehicleTypeId){
		body.error = 'Invalid Data';
		res.status(400);
		return res.send(body);
	}

	VehicleType.update({_id: req.body.vehicleTypeId}, 
		{
			$set: {
				status: req.body.status
			}
		},
		function(err, results){

			if(err){
				res.status(err.status || 500);
				body.error = err.message;
				return res.send(body);
			}

			if(results.n < 1){
				res.status(500);
				body.error = 'Something has gone wrong';
				return res.send(body);
			}

			VehicleType.findById(req.body.vehicleTypeId, function(err, vehicletype){

				if(err){
					// console.log('err    ', err);
					res.status(err.status || 500);
					body.error = err.message;
					return res.send(body);
				}

				if(vehicletype.status){
					body.successMsg = vehicletype.name + ' is now active';
				}else{
					body.successMsg = vehicletype.name + ' is no longer active';
				}

				res.status(200);
				body.vehicletype = vehicletype;
				return res.send(body);	

			});

		});

});

vehicles.get('/create-vehicle', mid.requiresLogin, function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		VehicleType.find({'status': true}, function(err, vTypes){

			if(err){
				return next(err);
			}

			return res.render('vehicles/create_vehicle', {
				user: user,
				title: 'Create Vehicle',
				years: helpful.getYears('past', 30),
				types: vTypes
			});

		});

	});

});

vehicles.post('/create-vehicle', mid.requiresLoginJSON, function(req, res, next){

	let body = {};

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'you dont have permission to access vehicles';
		res.status(403);
		return res.send(body);
	}

	let vechicleObj = {
		vehicle_number: req.body.vehicle_number,
	    year: req.body.year,
	    color: req.body.color,
	    type: req.body.type,
	    vin: req.body.vin,
	    rego: req.body.rego,
	    rego_expiry: helpful.dateUsToUk(req.body.rego_expiry),
	    coi_expiry: helpful.dateUsToUk(req.body.coi_expiry),
	    odometer: helpful.dateUsToUk(req.body.odometer),
        status: req.body.status
	};

	if(req.body.dot_booking){
		vechicleObj.dot_booking = helpful.dateUsToUk(req.body.dot_booking);
	}

	Vehicle.create(vechicleObj, function(err, vehicle){

		if(err){
			res.status(err.status || 500);
			body.error = err.message;
			return res.send(body);
		}

		body.vehicle = vehicle;
		return res.send(body);

	});

});

vehicles.get('/edit/:vehicleId', mid.requiresLogin, function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		Vehicle.findById(req.params.vehicleId).populate('type').exec(function(err, vehicle){

			if(err){
				return next(err);
			}

			if(vehicle == null || vehicle == undefined){
				let err = new Error('Vehicle Not Found');
				err.status(404);
				return next(err);
			}

			VehicleType.find({'status': true}).exec(function(err, vehicleTypes){

				if(err){
					return next(err);
				}

				console.log('ve ', vehicle);

				const rego_expiry = helpful.getDateForInput(vehicle.rego_expiry);
				const coi_expiry = helpful.getDateForInput(vehicle.coi_expiry);
				const dot_booking = helpful.getDateForInput(vehicle.dot_booking);

				res.status(200);
				return res.render('vehicles/edit_vehicle', {
					user: user,
					title: 'Edit Vehicle',
					vehicle: vehicle,
					rego_expiry: rego_expiry,
					coi_expiry: coi_expiry,
					types: vehicleTypes,
					dot_booking: dot_booking,
					years: helpful.getYears('past', 30, vehicle.year)
				});

			});

		});

	});

});

vehicles.post('/update', mid.requiresLoginJSON, function(req, res, next){

	let body = {};

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'you do not have permission to update vehicles';
		res.status(403);
		return res.send(body);
	}

	var vObj = {
		vehicle_number: req.body.vehicle_number,
        year: req.body.year,
        color: req.body.color,
        vin: req.body.vin,
        rego: req.body.rego,
        type: req.body.type,
        rego_expiry: helpful.dateUsToUk(req.body.rego_expiry),
        coi_expiry: helpful.dateUsToUk(req.body.coi_expiry),
        odometer: req.body.odometer,
        status: req.body.status
	};

	if(req.body.dot_booking){
		vObj.dot_booking = helpful.dateUsToUk(req.body.dot_booking);
	}

	Vehicle.update({_id: req.body.vehicleId}, 
		{
			$set: vObj
		},
		function(err, results){

			if(err){
				res.status(err.status || 500);
				body.error = err.message;
				return res.send(body);
			}	

			if(results.n < 1){
				res.status(500);
				body.error = 'Something has gone wrong';
				return res.send(body);
			}

			Vehicle.findById(req.body.vehicleId, function(err, vehicle){

				if(err){
					res.status(err.status || 500);
					body.error = err.message;
					return res.send(body);
				}

				body.vehicle = vehicle;
				res.status(200);
				return res.send(body);

			});

		}
	);

});

vehicles.post('/update-status', mid.requiresLoginJSON, function(req, res, next){

	let body = {};

	if(req.session.permissions[0][routePermission] == false){
		body.error = 'you do not have permission to update vehicles';
		res.status(403);
		return res.send(body);
	}

	if(req.body.status == null || req.body.status == undefined || !req.body.vehicleId){
		body.error = 'Invalid Data';
		res.status(400);
		return res.send(body);
	}

	Vehicle.update({_id: req.body.vehicleId}, 
		{
			$set: {
				status: req.body.status
			}
		},
		function(err, results){

			if(err){
				res.status(err.status || 500);
				body.error = err.message;
				return res.send(body);
			}

			if(results.n < 1){
				res.status(500);
				body.error = 'Something has gone wrong';
				return res.send(body);
			}

			Vehicle.findById(req.body.vehicleId, function(err, vehicle){

				if(err){
					res.status(err.status || 500);
					body.error = err.message;
					return res.send(body);
				}

				if(vehicle.status){
					body.successMsg = 'Vehicle ' + vehicle._id + ' is now active';
				}else{
					body.successMsg = 'Vehicle ' + vehicle._id + ' is no longer active';
				}

				res.status(200);
				body.vehicle = vehicle;
				return res.send(body);	

			});

		});

});

module.exports = vehicles;

