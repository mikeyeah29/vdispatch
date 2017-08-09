'use strict';

const express = require('express');
const drivers = express.Router();
const User = require('../models/user.js').User;
const Driver = require('../models/driver.js').Driver;
const Absence = require('../models/absence.js').Absence;
const getDateForInput = require('../helpers/main.js').getDateForInput;
const bcrypt = require('bcrypt');

const routePermission = 'management';

drivers.get('/', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}
	
	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		Driver.find({}).limit(30).exec(function(err, drivers){

			if(err){
				return next(err);
			}

			res.render('drivers/drivers', {
				title: 'All Drivers',
				user: user,
				drivers: drivers
			});

		});

	});

});

drivers.get('/overview', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		// THIS NEEDS TO ONLY RETURN DRIVERS WITH EXPIRING LICENCES ECT

		Driver.find({status: true}).select({'first_name':1, 'last_name':1, '_id':1}).exec(function(err, drivers){

			if(err){
				return next(err);
			}

			Driver.getExpiring(function(err, expiring){

				if(err){
					return next(err);
				}

				res.render('drivers/overview', {
					title: 'Drivers Overview',
					user: user,
					expiring: expiring,
					drivers: drivers
				});

			});			

		});

	});

});

drivers.get('/create-driver', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}
	
	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		res.render('drivers/create_driver', {
			title: 'Create Driver',
			user: user
		});

	});

});

drivers.post('/create-driver', function(req, res, next){

	let response = {};
	response.success = 0;

	if(req.session.permissions[0][routePermission] == false){
		response.error = 'Invalid Permissions';
		return res.send(response);
	}

	var dob = new Date(req.body.q_dob);

	const driverData = {
		first_name: req.body.q_first_name,
		last_name: req.body.q_last_name,
        dob: dob.getDate(),
		address: [{
			line1: req.body.q_address_line1,
			line2: req.body.q_address_line2,
            suburb: req.body.q_suburb,
            postcode: req.body.q_postcode
		}],
        email: req.body.q_email,
        phone: req.body.q_phone,
        driver_code: req.body.q_driver_code,
        password: req.body.q_password,
        driver_type: req.body.q_drivertype,
        driver_authorisation: {
            da_number: req.body.q_da_number,
            da_expiry: new Date(req.body.q_da_expiry),
            da_scan: req.body.q_da_scan
        },
        driver_licence: {
            dl_number: req.body.q_dl_number,
            dl_expiry: new Date(req.body.q_dl_expiry),
            dl_scan: req.body.q_dl_scan
        },
		payment_details: [{
            abn: req.body.q_abn,
            account: req.body.q_account,
            bsb: req.body.q_bsb
        }],
        color: req.body.q_color,
        status: req.body.q_status
	};

	Driver.create(driverData, function(error, driver){
		
		if(error){
			response.error = error.message;
			return res.send(response);
		}else{
			response.driver = driver;
			response.success = '1';
			return res.send(response);
		}
	
	});

});

drivers.get('/edit/:driverId', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}
	
	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		Driver.findById(req.params.driverId, function(err, driver){

			if(err){
				return next(err);
			}

			return res.render('drivers/update_driver', {
				title: 'Update Driver',
				user: user,
				driver: driver,
				dob: getDateForInput(driver.dob),
				da_expiry: getDateForInput(driver.driver_authorisation.da_expiry),
				dl_expiry: getDateForInput(driver.driver_licence.dl_expiry)
			});

		});

	});

});

drivers.post('/update-driver', function(req, res, next){

	let data = {};
	data.success = 0;

	if(req.session.permissions[0][routePermission] == false){
		data.error = 'Invalid Permissions';
		return res.send(data);
	}

	var driverObj = {
		first_name: req.body.q_first_name,
		last_name: req.body.q_last_name,
        dob: new Date(req.body.q_dob),
		address: [{
			line1: req.body.q_address_line1,
			line2: req.body.q_address_line2,
            suburb: req.body.q_suburb,
            postcode: req.body.q_postcode
		}],
        email: req.body.q_email,
        phone: req.body.q_phone,
        driver_code: req.body.q_driver_code,
        driver_type: req.body.q_drivertype,
        driver_authorisation: {
            da_number: req.body.q_da_number,
            da_expiry: new Date(req.body.q_da_expiry),
            da_scan: req.body.q_da_scan
        },
        driver_licence: {
            dl_number: req.body.q_dl_number,
            dl_expiry: new Date(req.body.q_dl_expiry),
            dl_scan: req.body.q_dl_scan
        },
		payment_details: [{
            abn: req.body.q_abn,
            account: req.body.q_account,
            bsb: req.body.q_bsb
        }],
        color: req.body.q_color,
        status: req.body.q_status
	};

	if(req.body.update_password == 'true'){
   
    	bcrypt.hash(req.body.q_password, 5, function(err, hash){

    		if(err){
    			data.error = err;
                return res.send(data);
    		}

    		driverObj.password = hash;

    		Driver.update(
				{
		        	"_id": req.body.driverId
		        }, 
		        {
		            $set: driverObj
		        },
		        function(err, affected, resp){
		            if(err){
		                data.error = err;
		                res.send(data);
		            }else{
		                
		            	Driver.findById(req.body.driverId, function(err, driver){

		            		if(err){
		            			data.error = err;
		                		res.send(data);
		            		}else{
		            			data.success = '1';
			            		data.driver = driver;
			                	res.send(data);
		            		}

		            	});

		            }
		        }
			);

    	});
   
    }else{

    	Driver.update(
			{
	        	"_id": req.body.driverId
	        }, 
	        {
	            $set: driverObj
	        },
	        function(err, affected, resp){
	            if(err){
	                data.error = err;
	                res.send(data);
	            }else{
	                
	            	Driver.findById(req.body.driverId, function(err, driver){

	            		if(err){
	            			data.error = err;
	                		res.send(data);
	            		}else{
	            			data.success = '1';
		            		data.driver = driver;
		                	res.send(data);
	            		}

	            	});

	            }
	        }
		);

    }

});

drivers.post('/update_driver_status', function(req, res, next){

	let response = {};
	response.success = 0;

	if(req.session.permissions[0][routePermission] == false){
		response.error = 'Invalid Permissions';
		return res.send(response);
	}

	Driver.update(
		{
        	"_id": req.body.driverId
        }, 
        {
            $set: {
            	status: req.body.status
            }
        },
        function(err, affected){
            if(err){
                response.error = err;
                return res.send(response);
            }else{
                
            	if(affected.n < 1){
            		response.error = 'Driver could not be updated';
                	return res.send(response);
            	}

            	response.success = '1';
            	if(req.body.status == 'true'){
            		response.successMsg = 'Driver Activated';
            	}else{
            		response.successMsg = 'Driver no longer active';
            	}
            	res.send(response);

            }
        }
	);

});

drivers.post('/get-absences', function(req, res, next){

	let response = {};
	response.success = 0;

	if(req.session.permissions[0][routePermission] == false){
		response.error = 'Invalid Permissions';
		return res.send(response);
	}

	Absence.find({}).populate('driver', ['color', '_id', 'first_name', 'last_name']).exec(function(err, absences){

		if(err){
			response.error = err.message;
			return res.send(response);
		}else{

			response.absences = absences;
			response.success = '1';
			return res.send(response);

		}

	});

});

drivers.post('/add-absence', function(req, res, next){

	let response = {};
	response.success = 0;

	if(req.session.permissions[0][routePermission] == false){
		response.error = 'Invalid Permissions';
		return res.send(response);
	}

	var absenceData = {
		driver: req.body.driverId,
		startDate: req.body.startDate, 
		endDate: req.body.endDate
	};

	Absence.addAbsence(absenceData, function(error, absences){

		if(error){
			response.error = 'Invalid Permissions';
			return res.send(response);
		}

		response.absences = absences;
		response.success = '1';
		return res.send(response);

	});

	// Absence.create(absenceData, function(error, absence){
		
	// 	if(error){
	// 		response.error = error.message;
	// 		return res.send(response);
	// 	}else{
	// 		response.absence = absence;
	// 		response.success = '1';
	// 		return res.send(response);
	// 	}
	
	// });

});

drivers.post('/update-absence', function(req, res, next){

	let response = {};
	response.success = 0;

	if(req.session.permissions[0][routePermission] == false){
		response.error = 'Invalid Permissions';
		return res.send(response);
	}

	Absence.update(
		{
        	"_id": req.body.absenceId
        }, 
        {
            $set: {
            	startDate: req.body.startDate,
            	endDate: req.body.endDate
            }
        },
        function(err, affected){
            if(err){
                response.error = err;
                res.send(response);
            }else{

            	console.log('affected ', affected);
                
                if(affected.n < 1){
                	response.error = 'Update Failed';
                	return res.send(response);
                }

            	Absence.find({}).populate('driver', ['color', '_id', 'first_name', 'last_name']).exec(function(err, absences){
					if(err){
						response.error = err.message;
						return res.send(response);
					}
					response.success = '1';
					response.absences = absences;
					return res.send(response);
				});

            }
        }
	);

});

drivers.post('/remove-absence', function(req, res, next){

	let response = {};
	response.success = '0';

	if(req.session.permissions[0][routePermission] == false){
		response.error = 'Invalid Permissions';
		return res.send(response);
	}

	console.log(req.body.absenceId);

	Absence.remove({_id: req.body.absenceId}, function(err){
		
		if(err){
			response.error = err.message;
			return res.send(response);
		}

		Absence.find({}).populate('driver', ['color', '_id', 'first_name', 'last_name']).exec(function(err, absences){
			if(err){
				response.error = err.message;
				return res.send(response);
			}
			response.success = '1';
			response.absences = absences;
			return res.send(response);
		});
		
	});

});

module.exports = drivers;




// overview

// all

// add new

// edit

// add driver absence