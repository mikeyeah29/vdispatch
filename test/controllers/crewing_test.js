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

describe('Crewing Routes', () => {

    describe('GET /', () => {

        // no on logged in
        it('should redirect to homepage as no one is logged in', (done) => {

            chai.request(server)
                .get('/crewing')
                .end((err, res) => {
                    res.should.redirect;
                    done();
                });

        });

        // logged in without permission
        it('should redirect to homepage as Tony Stark is unauthorised to view crewing', (done) => {

            logAvengerIn('tony', function(agent){

                agent.get('/crewing')
                    .end(function (err, res) {
                        res.should.redirect;
                        done();
                    });

            });

        });

        // logged in with permission
        it('should render the crewing defaults page', (done) => {

            logAvengerIn('antman', function(agent){

                agent.get('/crewing')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });

            });

        });

    });

    describe('GET /transfers', () => {

        // no on logged in
        it('should redirect to homepage as no one is logged in', (done) => {

            chai.request(server)
                .get('/crewing/transfers')
                .end((err, res) => {
                    res.should.redirect;
                    done();
                });

        });

        // logged in without permission
        it('should redirect to homepage as Tony Stark is unauthorised to view crewing', (done) => {

            logAvengerIn('tony', function(agent){

                agent.get('/crewing/transfers')
                    .end(function (err, res) {
                        res.should.redirect;
                        done();
                    });

            });

        });

        // logged in with permission
        it('should render the crewing transfers page', (done) => {

            logAvengerIn('antman', function(agent){

                agent.get('/crewing/transfers')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });

            });

        });

    });

    describe('GET /search', () => {

        // no on logged in
        it('should redirect to homepage as no one is logged in', (done) => {

            chai.request(server)
                .get('/crewing/search')
                .end((err, res) => {
                    res.should.redirect;
                    done();
                });

        });

        // logged in without permission
        it('should redirect to homepage as Tony Stark is unauthorised to view crewing', (done) => {

            logAvengerIn('tony', function(agent){

                agent.get('/crewing/search')
                    .end(function (err, res) {
                        res.should.redirect;
                        done();
                    });

            });

        });

        // logged in with permission
        it('should render the crewing search page', (done) => {

            logAvengerIn('antman', function(agent){

                agent.get('/crewing/search')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });

            });

        });

    });

});