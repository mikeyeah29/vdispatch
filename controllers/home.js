'use strict';

const express = require('express');
const home = express.Router();
const User = require('../models/user.js').User;
const Locaton = require('../models/location.js').Locaton;
const mid = require('../middlewares/index');

home.get('/', mid.loggedIn, function(req, res, next){

	res.render('home', {
		title: 'Login'
	});
	
});

home.post('/', function(req, res, next){
	
	var response = {};

	if(req.body.email && req.body.password){

		User.authenticate(req.body.email, req.body.password, function(err, user){

			if(err || !user){
				response.error = 'Wrong email or password';
				return res.send(response);
			}else{

				if(!user.status){
					response.error = 'User No Longer Active';
					return res.send(response);
				}

				req.session.userId = user._id;
				req.session.permissions = user.permissions;
				response.user = user;
				return res.send(response);
			}

		});

	}else{
		response.error = 'Missing Fields';
		return res.send(response);
	}

});

home.get('/dashboard', mid.requiresLogin, function(req, res, next){

	User.findById(req.session.userId).exec(function(err, user){

		if(err){
			return next(err);
		}else{
			res.render('dashboard', {
				title: 'Dashboard',
				user: user
			});
		}

	});	

});

home.get('/logout', function(req, res, next){

	if(req.session){
		req.session.destroy(function(err){
			if(err){
				return next(err);
			}else{
				return res.redirect('/');
			}
		});
	}

});

// dispatch

module.exports = home;