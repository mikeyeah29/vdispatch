process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../../models/user').User;
let Booking = require('../../models/booking').Booking;

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
        thor: 'thor@odenson.com',
        antman: 'ant@man.com'
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

	describe('GET /booking', () => {

		it('should redirect to homepage as no one is logged in', (done) => {

            chai.request(server)
                .get('/booking')
                .end((err, res) => {
                    res.should.redirect;
                    done();
                });

        });

        it('should redirect to homepage as tony is unauthorised to view bookings', (done) => {

            logAvengerIn('tony', function(agent){

                agent.get('/booking')
                    .end(function (err, res) {
                        res.should.redirect;
                        done();
                    });

            });

        });

        it('should render the bookings overview page, as nick fury is logged in', (done) => {

            logAvengerIn('nick', function(agent){

                agent.get('/booking')
                    .end(function (err, res) {
                        // res.should.not.redirect;
                        res.should.have.status(200);
                        done();
                    });

            });

        });

        it('should render the bookings overview page, as ant man is logged in', (done) => {

            logAvengerIn('antman', function(agent){

                agent.get('/booking')
                    .end(function (err, res) {
                        // res.should.not.redirect;
                        res.should.have.status(200);
                        done();
                    });

            });

        });

	});

	describe('GET /booking/search', () => {

		it('should redirect to homepage as no one is logged in', (done) => {

            chai.request(server)
                .get('/booking/search')
                .end((err, res) => {
                    res.should.redirect;
                    done();
                });

        });

        it('should redirect to homepage as tony is unauthorised to view bookings', (done) => {

            logAvengerIn('tony', function(agent){

                agent.get('/booking/search')
                    .end(function (err, res) {
                        res.should.redirect;
                        done();
                    });

            });

        });

        it('should render the bookings search page, as nick fury is logged in', (done) => {

            logAvengerIn('nick', function(agent){

                agent.get('/booking/search')
                    .end(function (err, res) {
                        // res.should.not.redirect;
                        res.should.have.status(200);
                        done();
                    });

            });

        });

        it('should render the bookings search page, as ant man is logged in', (done) => {

            logAvengerIn('antman', function(agent){

                agent.get('/booking/search')
                    .end(function (err, res) {
                        // res.should.not.redirect;
                        res.should.have.status(200);
                        done();
                    });

            });

        });
		
	});

	describe('GET /booking/edit/:bookingId', () => {

		let bookingId = '';

		before(function(done){

			Booking.create({}, function(err, booking){
				bookingId = booking._id;
				done();
			});

		});

		it('should redirect to homepage as no one is logged in', (done) => {

            chai.request(server)
                .get('/booking/edit/' + bookingId)
                .end((err, res) => {
                    res.should.redirect;
                    done();
                });

        });

        it('should redirect to homepage as tony is unauthorised to view bookings', (done) => {

            logAvengerIn('tony', function(agent){

                agent.get('/booking/edit/' + bookingId)
                    .end(function (err, res) {
                        res.should.redirect;
                        done();
                    });

            });

        });

        it('should render the edit booking page, as nick fury is logged in', (done) => {

            logAvengerIn('nick', function(agent){

                agent.get('/booking/edit/' + bookingId)
                    .end(function (err, res) {
                        // res.should.not.redirect;
                        res.should.have.status(200);
                        done();
                    });

            });

        });

        it('should render the edit booking page, as ant man is logged in', (done) => {

            logAvengerIn('antman', function(agent){

                agent.get('/booking/edit/' + bookingId)
                    .end(function (err, res) {
                        // res.should.not.redirect;
                        res.should.have.status(200);
                        done();
                    });

            });

        });
		
	});

});