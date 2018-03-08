'use strict';

const express = require('express');
const users = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.js').User;
const helper = require('../helpers/main.js');

const routePermission = 'administrator';

users.get('/', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		User.find({}).limit(30).exec((err, users) => {

			if(err){
				return next(err);
			}

			return res.render('users/users', {
				title: 'Users',
				user: user,
				users: users
			});

		});

	});

});

users.post('/', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		if(!req.body.term){

			User.find({}).limit(30).exec((err, users) => {

				if(err){
					return next(err);
				}

				return res.render('users/users', {
					title: 'Search Users',
					user: user,
					users: users,
					search: 'No search term given'
				});

			});

		}else{

			User.find({ $or:[
				{first_name: new RegExp(req.body.term, 'i')},
				{last_name: new RegExp(req.body.term, 'i')}
			]})
			.limit(30)
			.exec((err, users) => {

				if(err){
					return next(err);
				}

				return res.render('users/users', {
					title: 'Search User',
					user: user,
					users: users,
					search: 'Search results for ' + req.body.term
				});

			});

		}

	});

});

users.get('/create-user', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		res.render('users/create_user', {
			title: 'Create User',
			user: user
		});

	});

});

users.post('/create-user', function(req, res, next){

	let response = {};
	response.success = 0;

	if(req.session.permissions[0][routePermission] == false){
		response.error = 'Invalid Permissions';
		return res.send(response);
	}

	let dataValid = true;

	if(!req.body.q_firstname || req.body.q_firstname == ''){
		response.error = 'First Name Missing';
		dataValid = false;
	}

	if(!req.body.q_lastname || req.body.q_lastname == ''){
		response.error = 'Last Name Missing';
		dataValid = false;
	}
		
	if(!req.body.q_email || req.body.q_email == ''){
		response.error = 'Email Missing';
		dataValid = false;
	}

	if(!req.body.q_password || req.body.q_password == ''){
		response.error = 'Password Name Missing';
		dataValid = false;
	}	
		
	if(!req.body.q_phone || req.body.q_phone == ''){
		response.error = 'Phone Missing';
		dataValid = false;
	}

	if(!req.body.q_address_1 || req.body.q_address_1 == ''){
		response.error = 'address 1 missing';
		dataValid = false;
	}

	if(!req.body.q_suburb || req.body.q_suburb == ''){
		response.error = 'Suburb Missing';
		dataValid = false;
	}

	if(!req.body.q_postcode || req.body.q_postcode == ''){
		response.error = 'Post code Missing';
		dataValid = false;
	}

	if(!req.body.q_bankname || req.body.q_bankname == ''){
		response.error = 'bankname';
		dataValid = false;
	}
		
	if(!req.body.q_accountnumber || req.body.q_accountnumber == ''){
		response.error = 'account Missing';
		dataValid = false;
	}

	if(!req.body.q_bsb || req.body.q_bsb == ''){
		response.error = 'bsb Missing';
		dataValid = false;
	}
		
	if(!req.body.q_perm_administrator || req.body.q_perm_administrator == ''){
		response.error = 'p amin';
		dataValid = false;
	}

	if(!req.body.q_perm_management || req.body.q_perm_management == ''){
		response.error = 'p man Missing';
		dataValid = false;
	}		

	if(!req.body.q_perm_reservations || req.body.q_perm_reservations == ''){
		response.error = 'p res Missing';
		dataValid = false;
	}

	if(!req.body.q_perm_operations || req.body.q_perm_operations == ''){
		response.error = 'p op Missing';
		dataValid = false;
	}

	if(!req.body.q_perm_accounts || req.body.q_perm_accounts == ''){
		response.error = 'p accounts Missing';
		dataValid = false;
	}

	if(!req.body.q_perm_reports || req.body.q_perm_reports == ''){
		response.error = 'p reports Missing';
		dataValid = false;
	}

	if(!req.body.q_useractive || req.body.q_useractive == ''){
		response.error = 'p user active Missing';
		dataValid = false;
	}

	if(!dataValid){
		response.error = 'Missing Required Feilds';
		return res.send(response);
	}

	if(req.body.q_password !== req.body.q_password_confirm){
		response.error = 'Passwords Do Not Match';
		return res.send(response);
	}

	// otherwise all is good so create user... 

	const userData = {
		created_at: new Date(),
		first_name: req.body.q_firstname,
		last_name: req.body.q_lastname,
		email: req.body.q_email,
		password: req.body.q_password,
	    phone: req.body.q_phone,
		address: [{
			line1: req.body.q_address_1,
			line2: req.body.q_address_2 || '',
	        suburb: req.body.q_suburb,
	        city: req.body.q_city,
	        postcode: req.body.q_postcode
		}],
		payment_details: [{
			bank_name: req.body.q_bankname,
	        account: req.body.q_accountnumber,
	        bsb: req.body.q_bsb
	    }],
	    permissions: [{
	        administrator: req.body.q_perm_administrator,
	        management: req.body.q_perm_management,
	        reservations: req.body.q_perm_reservations,
	        operations: req.body.q_perm_operations,
	        accounts: req.body.q_perm_accounts,
	        reports: req.body.q_perm_reports
	    }],
	    status: req.body.q_useractive
	}

	User.create(userData, function(error, user){
		
		if(error){
			response.error = error;
			return res.send(response);
		}else{
			response.user = user;
			response.success = '1';
			return res.send(response);
		}
	
	});

});

users.get('/edit/:userId', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	const userId = req.params.userId;

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}

		User.findById(userId).exec(function(err, user_edit){
		
			if(err){
				return next(err);
			}

			res.render('users/update_user', {
				title: 'Edit User',
				user: user,
				user_edit: user_edit 
			});
		
		});
		
	});

});

users.post('/update-user', function(req, res, next){

	var data = {};
	data.success = '0';

	if(req.session.permissions[0][routePermission] == false){
		return res.send(data);
	}

	var updateUserObj = {
        first_name: req.body.q_firstname,
		last_name: req.body.q_lastname,
		email: req.body.q_email,
	    phone: req.body.q_phone,
		address: [{
			line1: req.body.q_address_1,
			line2: req.body.q_address_2 || '',
	        suburb: req.body.q_suburb,
	        city: req.body.q_city,
	        postcode: req.body.q_postcode
		}],
		payment_details: [{
			bank_name: req.body.q_bankname,
	        account: req.body.q_accountnumber,
	        bsb: req.body.q_bsb
	    }],
	    permissions: [{
	        administrator: req.body.q_perm_administrator,
	        management: req.body.q_perm_management,
	        reservations: req.body.q_perm_reservations,
	        operations: req.body.q_perm_operations,
	        accounts: req.body.q_perm_accounts,
	        reports: req.body.q_perm_reports
	    }],
	    status: req.body.q_useractive
    };

    if(req.body.update_password == 'true'){
   
    	bcrypt.hash(req.body.q_password, 5, function(err, hash){

    		if(err){
    			data.error = err;
                return res.send(data);
    		}

    		updateUserObj.password = hash;

    		User.update(
				{
		        	"_id": req.body.userId
		        }, 
		        {
		            $set: updateUserObj
		        },
		        function(err, affected, resp){
		            if(err){
		                data.error = err;
		                res.send(data);
		            }else{
		                
		            	User.findById(req.body.userId, function(err, user){

		            		if(err){
		            			data.error = err;
		                		res.send(data);
		            		}else{
		            			data.success = '1';
			            		data.user = user;
			                	res.send(data);
		            		}

		            	});

		            }
		        }
			);

    	});
   
    }else{

    	User.update(
			{
	        	"_id": req.body.userId
	        }, 
	        {
	            $set: updateUserObj
	        },
	        function(err, affected, resp){
	            if(err){
	                data.error = err;
	                res.send(data);
	            }else{
	                
	            	User.findById(req.body.userId, function(err, user){

	            		if(err){
	            			data.error = err;
	                		res.send(data);
	            		}else{
	            			data.success = '1';
		            		data.user = user;
		                	res.send(data);
	            		}

	            	});

	            }
	        }
		);

    }

});

users.post('/update_user_status', function(req, res, next){

	let response = {};
	response.success = 0;

	if(req.session.permissions[0][routePermission] == false){
		response.error = 'Invalid Permissions';
		return res.send(response);
	}

	User.update(
		{
        	"_id": req.body.userId
        }, 
        {
            $set: {
            	status: req.body.status
            }
        },
        function(err, affected){
            if(err){
                response.error = err;
                res.send(response);
            }else{
                
            	if(affected.n < 1){
            		response.error = 'User could not be updated';
                	return res.send(response);
            	}

            	response.success = '1';
            	if(req.body.status == 'true'){
            		response.successMsg = 'User Activated';
            	}else{
            		response.successMsg = 'User no longer active';
            	}
            	res.send(response);

            }
        }
	);

});

module.exports = users;