'use strict';

const express = require('express');
const pricing_variables = express.Router();
const User = require('../models/user.js').User;
const PricingVariables = require('../models/pricing_variable.js').PricingVariables;
const helper = require('../helpers/main.js');
const config = require('../config.json');

const routePermission = 'administrator';

pricing_variables.get('/', function(req, res, next){

	if(req.session.permissions[0][routePermission] == false){
		return res.redirect('/dashboard');
	}

	User.findById(req.session.userId).exec(function(err, user){

		PricingVariables.find({}).exec(function(err, pvars){

			if(err){
				return next(err);
			}

			res.render('pricing_variables/pricing_variables', {
				title: 'Pricing Variables',
				user: user,
				pvars: pvars
			});

		});

	});

});

pricing_variables.post('/update', function(req, res, next){

	let response = {};
	response.success = 0;

	if(req.session.permissions[0][routePermission] == false){
		response.error = 'Invalid Permissions';
		return res.send(response);
	}

	PricingVariables.update(
		{
        	"name": req.body.name
        },
        {
        	$set: {
		        price: req.body.price
        	}
        },
        function(err, affected, resp){

        	if(err){
        		response.error = 'Pricing Variables failed to update';
				return res.send(response);
        	}

        	PricingVariables.find({}).exec(function(err, pvars){

        		if(err){
        			response.error = err;
        			return res.send(response);
        		}

        		response.pvars = pvars;
        		response.success = 1;
        		return res.send(response);

        	});

        }
	);

});

module.exports = pricing_variables;