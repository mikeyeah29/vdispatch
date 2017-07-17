'use strict';

const express = require('express');
const accounts = express.Router();
const User = require('../models/user.js').User;
const Account = require('../models/account.js').Account;
const RateSheet = require('../models/ratesheet.js').RateSheet;
const Suburb = require('../models/suburb.js').Suburb;

const getAccountCats = require('../helpers/accounts_help.js').getAccountCats;

const routePermission = 'management';

accounts.get('/', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}else{

			Account.find({}).limit(30).exec(function(err, accounts){

				const accountCats = getAccountCats();

				RateSheet.find({}).select({name: 1}).exec(function(err, ratesheets){

					if(err){
						return next(err);
					}

					res.render('accounts/accounts', {
						title: 'All Accounts',
						user: user,
						accounts: accounts,
						accountCats: accountCats,
						ratesheets: ratesheets
					});

				});

			});

		}

	});

});

accounts.get('/overview', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}else{
			
			res.render('accounts/overview', {
				title: 'Accounts Overview',
				user: user
			});

		}

	});

});

accounts.get('/create-account', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	var accountCats = getAccountCats();

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}else{
			
			Account.find({}).exec(function(err, parantAccounts){

				RateSheet.find({}).select({name: 1}).exec(function(err, ratesheets){

					if(err){
						return next(err);
					}else{
						res.render('accounts/create_account', {
							title: 'Create Account',
							user: user,
							parantAccounts: parantAccounts,
							accountCats: accountCats,
							ratesheets: ratesheets
						});
					}

				});

			});

		}

	});

});

accounts.post('/create-account', function(req, res, next){

	let response = {};
	response.success = 0;

	if(req.session.permissions[0][routePermission] == false){
		response.error = 'Invalid Permissions';
		return res.send(response);
	}

	const accountData = {
		name: req.body.q_full_company_name,
	    abn: req.body.q_company_abn,
	    lookup: req.body.q_lookup_name,
	    parent_account: req.body.q_parent_account,
	    account_category: req.body.q_account_category,
	    address: [{
	        line1: req.body.q_address_1,
	        line2: req.body.q_address_2,
	        suburb: req.body.q_suburb,
	        postcode: req.body.q_postcode
	    }],
	    contact_details: [{
	        primary_phone: req.body.q_primary_phone,
	        primary_email: req.body.q_primary_email,
	        confirmation_phone: req.body.q_confirmation_phone,
	        confirmation_email: req.body.q_confirmation_email,
	        accounts_phone: req.body.q_accounts_phone,
	        accounts_email: req.body.q_accounts_email
	    }],
	    default_notes: [{
	        booking_note: req.body.q_booking_note,
	        office_note: req.body.q_office_note,
	        driver_note: req.body.q_driver_note
	    }],
	    pricing: [{
	        current_ratesheet: req.body.q_current_ratesheet,
	        airport_fee: req.body.q_airport_fee,
	        after_hours: req.body.q_after_hours,
	        cancellation_period: req.body.q_cancellation_period
	    }],
	    invoicing: [{
	        invoice_cycle: req.body.q_invoice_cycle,
	        stop_credit: req.body.q_stop_credit
	    }],
	    status: req.body.q_status
	};

	Account.create(accountData, function(error, account){
		
		if(error){
			response.error = error;
			return res.send(response);
		}else{
			response.account = account;
			response.success = '1';
			return res.send(response);
		}
	
	});

});

accounts.get('/edit/:accountId', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	const accountId = req.params.accountId;

	User.findById(req.session.userId).exec(function(err, user){

		Account.find({}).where('_id').ne(accountId).exec(function(err, parantAccounts){
			Account.findById(accountId).exec(function(err, account){
				
				if(err){
					return next(err);
				}

				var accountCats = getAccountCats(account.account_category);

				RateSheet.find({}).select({name: 1}).exec(function(err, ratesheets){

					if(err){
						return next(err);
					}else{

						res.render('accounts/update_account', {
							title: 'Edit Account',
							user: user,
							account: account,
							parantAccounts: parantAccounts,
							accountCats: accountCats,
							ratesheets: ratesheets
						});
						
					}

				});
			
			});
		});

	});

});

accounts.post('/update-account', function(req, res, next){

	var data = {};
	data.success = '0';

	if(req.session.permissions[0][routePermission] == false){
		return res.send(data);
	}

	const accountData = {
		name: req.body.q_full_company_name,
	    abn: req.body.q_company_abn,
	    lookup: req.body.q_lookup_name,
	    parent_account: req.body.q_parent_account,
	    account_category: req.body.q_account_category,
	    address: [{
	        line1: req.body.q_address_1,
	        line2: req.body.q_address_2,
	        suburb: req.body.q_suburb,
	        postcode: req.body.q_postcode
	    }],
	    contact_details: [{
	        primary_phone: req.body.q_primary_phone,
	        primary_email: req.body.q_primary_email,
	        confirmation_phone: req.body.q_confirmation_phone,
	        confirmation_email: req.body.q_confirmation_email,
	        accounts_phone: req.body.q_accounts_phone,
	        accounts_email: req.body.q_accounts_email
	    }],
	    default_notes: [{
	        booking_note: req.body.q_booking_note,
	        office_note: req.body.q_office_note,
	        driver_note: req.body.q_driver_note
	    }],
	    pricing: [{
	        current_ratesheet: req.body.q_current_ratesheet,
	        airport_fee: req.body.q_airport_fee,
	        after_hours: req.body.q_after_hours,
	        cancellation_period: req.body.q_cancellation_period
	    }],
	    invoicing: [{
	        invoice_cycle: req.body.q_invoice_cycle,
	        stop_credit: req.body.q_stop_credit
	    }],
	    status: req.body.q_status
	};

	Account.update(
		{
        	"_id": req.body.accountId
        }, 
        {
            $set: accountData
        },
        function(err, affected){
            if(err){
                data.error = err;
                res.send(data);
            }else{

            	console.log('affected ', affected);
                
                if(affected.n < 1){
                	data.error = 'Update Failed';
                	return res.send(data);
                }

            	data.success = '1';
            	res.send(data);

            }
        }
	);

});

accounts.post('/update_account_status', function(req, res, next){

	let response = {};
	response.success = 0;

	if(req.session.permissions[0][routePermission] == false){
		response.error = 'Invalid Permissions';
		return res.send(response);
	}

	Account.update(
		{
        	"_id": req.body.accountId
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
            		response.error = 'Account could not be updated';
                	return res.send(response);
            	}

            	response.success = '1';
            	if(req.body.status == 'true'){
            		response.successMsg = 'Account Activated';
            	}else{
            		response.successMsg = 'Account no longer active';
            	}
            	res.send(response);

            }
        }
	);

});

accounts.post('/filter-accounts', function(req, res, next){

	let response = {};
	response.success = 0;

	if(req.session.permissions[0][routePermission] == false){
		response.error = 'Invalid Permissions';
		return res.send(response);
	}

	let filterObj = {};

	if(req.body.cat != ''){
		filterObj.account_category = req.body.cat;
	}

	if(req.body.rates != ''){
		filterObj.pricing = {$elemMatch:{current_ratesheet: req.body.rates}};
	}

	Account.find(filterObj).exec(function(err, accounts){

		if(err){
			response.error = err;
			return res.send(response);
		}

		response.success = 1;
		response.accounts = accounts;
		return res.send(response);

	});

});

module.exports = accounts;