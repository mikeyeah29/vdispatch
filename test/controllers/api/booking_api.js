process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../../models/user').User;
let VehicleType = require('../../models/vehicle_type').VehicleType;
let Vehicle = require('../../models/vehicle').Vehicle;

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();
let expect = chai.expect();
let userTestData = require('../data/users.json');
let vehicleTypeTestData = require('../data/vehicletypes.json');
let vehicleTestData = require('../data/vehicles.json');
let async = require('async');

chai.use(chaiHttp);

var agent = chai.request.agent(server);

/*

    nick fury - has access to everything    123
    tony - only admin                       123  
    thor odenson - managment                123  
    ant man - reservations                  123
    steve rogers - operations               123 
    bruce banner - accounts                 123 
    Natasha Romanova - reports              123

*/

function logAvengerIn(avenger, callback){

    var avengers = {
        nick: 'nick@fury.com',
        tony: 'tony@stark.com',
        thor: 'thor@odenson.com'
    };

    agent
        .post('/')
        .send({ email: avengers[avenger], password: '123'})
        .end(function (err, res) {

            var loggedInUser = res.body.user;
            res.should.have.a.cookie;
            callback(agent, loggedInUser);
            
        });

}

describe('Booking Routes', () => {

	describe('POST /api/booking/create-booking', () => {
		
	});

    // used for search, query string params will be used

    describe('GET /api/booking/search-bookings', () => {
        
    });

});