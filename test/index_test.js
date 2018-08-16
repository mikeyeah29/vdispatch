process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/user').User;
let Booking = require('../models/booking').Booking;

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let expect = chai.expect();
let userTestData = require('./data/users.json');
let vehicleTypeTestData = require('./data/vehicletypes.json');
let vehicleTestData = require('./data/vehicles.json');
let async = require('async');

before(function(done){

    User.remove({}, function(err){
        let count = 0;
        async.each(userTestData, function(userData, callback) {
            User.create(userData, function(err, users){
                count++;
                if(count == userTestData.length){

                	done();

                }else{
                    callback();
                }
            });
        });
    });

});

// API Tests
var booking_api = require('./controllers/api/booking_api_test.js');
var crewing_api_test = require('./controllers/api/crewing_api_test.js');
var dispatch_api_test = require('./controllers/api/dispatch_api_test.js');

//var vehicles_controller = require('./controllers/vehicles_test.js');
//var booking_controller = require('./controllers/bookings_test.js');
//var crewing_controller = require('./controllers/crewing_test.js');