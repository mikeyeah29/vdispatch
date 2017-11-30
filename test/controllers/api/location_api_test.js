process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../../models/user').User;
let Locaton = require('../../models/location.js').Locaton;

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

describe('Location Routes', () => {

    beforeEach(function(done){

        var Suburb = require('../../models/suburb').Suburb;
        var aeroglenId, parramattaParkId, earlvilleId;

        // Suburb.create({suburb: 'Aeroglen', postcode: '400'}, (err, aeroglen) => {
        //     Suburb.find({suburb: 'Parramatta Park'}, (err, parramattaPark) => {
        //         Suburb.find({suburb: 'Earlville'}, (err, earlville) => {

        //             async.each(locationData, 
        //                 function(locData, callback) {



        //                 },
        //                 function(err){

        //                 }
        //             );

        //         });
        //     });
        // });

    });

    afterEach(function(done){

        Locaton.remove({}, (err) => {
            done();
        });

    });    

    describe('GET /filter/:filter', () => {

    });

    describe('POST /add', () => {

    });



});