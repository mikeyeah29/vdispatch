process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../../../models/user').User;
let Booking = require('../../../models/booking').Booking;
let CrewingDefault = require('../../../models/crewing_default').CrewingDefault;
let Account = require('../../../models/account').Account;

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../app');
let should = chai.should();
let expect = chai.expect();
let userTestData = require('../../data/users.json');
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

function testStatus(avenger, status, url, done){

    if(!avenger){
        chai.request(server)
            .post(url)
            .end((err, res) => {
                res.should.have.status(status);
                done();
            });
    }else{
        logAvengerIn(avenger, function(agent){

            agent.post(url)
                .send({})
                .end(function (err, res) {
                    res.should.have.status(status);
                    done();
                });

        });
    }
    
}

function createJetstar(callback){

    Account.create({
        name: 'Jetstar',
        abn: '43543',
        lookup: 'jstar',
        account_category: 'Crewing',
        status: true
    }, function(err, account){

        CrewingDefault.create({
            account: account,
            name: 'Jetstar'
        }, function(err, crewDef){
            callback(crewDef);
        });

    });

}

describe('Crewing API Routes', () => {

    describe('POST /api/crewing/create', () => {

        let account;

        beforeEach((done) => {
            Account.create({
                name: 'Airline',
                abn: '43543',
                lookup: 'airline',
                account_category: 'Crewing',
                status: true
            }, function(err, hmm){
                account = hmm;
                done();
            });
        });

        afterEach((done) => {
            CrewingDefault.remove({}, function(err){
                Account.remove({}, function(err){
                    done();
                });
            });
        });

        // no on logged in
        it('should return 401 as no one is logged in', (done) => {
            testStatus(null, 401, '/api/crewing/create', done);
        });

        // logged in without permission
        it('should return 403 as tony has no permission to access crewing', (done) => {
            testStatus('tony', 403, '/api/crewing/create', done);
        });

        // logged in with permission
        // it('should create and return 200 status', (done) => {
        //     testStatus('antman', 200, '/api/crewing/create', done);
        // });

        it('should create a new crewing defaults', (done) => {

            logAvengerIn('antman', function(agent){
                agent.post('/api/crewing/create')
                    .send({
                        account: account._id,
                        name: 'Airline'
                    })
                    .end(function (err, res) {
                        res.should.have.status(200);
                        CrewingDefault.findOne({}, function(err, crewDefault){
                            crewDefault.name.should.equal('Airline');
                            done();
                        });
                    });
            });

        });

    });

    describe('POST /api/crewing/update-hotel', () => {

        let jetStar;

        beforeEach((done) => {
            createJetstar(function(hmm){
                jetStar = hmm;
                done();
            });
        });

        afterEach((done) => {
            CrewingDefault.remove({}, function(err){
                Account.remove({}, function(err){
                    done();
                });
            });
        });

        // no on logged in
        it('should return 401 as no one is logged in', (done) => {
            testStatus(null, 401, '/api/crewing/update-hotel', done);
        });

        // logged in without permission
        it('should return 403 as tony has no permission to access crewing', (done) => {
            testStatus('tony', 403, '/api/crewing/update-hotel', done);
        });

        it('should update hotel', (done) => {

            logAvengerIn('antman', function(agent){
                agent.post('/api/crewing/update-hotel')
                    .send({
                        crewing_id: jetStar._id,
                        location: 'The Star Hotel',
                        line2: 'Mond jsk',
                        suburb: 'Yeah',
                        zone: 'C1'
                    })
                    .end(function (err, res) {
                        CrewingDefault.findOne({}, function(err, crewDefault){
                            res.should.have.status(200);
                            crewDefault.name.should.equal('Jetstar');
                            crewDefault.hotel.location.should.equal('The Star Hotel');
                            done();
                        });
                    });
            });                                
        });

    });

    describe('POST /api/crewing/update-prices', () => {

        let jetStar;

        beforeEach((done) => {
            createJetstar(function(hmm){
                jetStar = hmm;
                done();
            });
        });

        afterEach((done) => {
            CrewingDefault.remove({}, function(err){
                Account.remove({}, function(err){
                    done();
                });
            });
        });

        // no on logged in
        it('should return 401 as no one is logged in', (done) => {
            testStatus(null, 401, '/api/crewing/update-prices', done);
        });

        // logged in without permission
        it('should return 403 as tony has no permission to access crewing', (done) => {
            testStatus('tony', 403, '/api/crewing/update-prices', done);
        });

        it('should return 400 status as prices not sent', (done) => {
            logAvengerIn('antman', function(agent){
                agent.post('/api/crewing/update-prices')
                    .send({
                            crewing_id: jetStar._id
                    })
                    .end(function (err, res) {
                        CrewingDefault.findOne({}, function(err, crewDefault){
                            res.should.have.status(400);
                            done();
                        });
                    });
            });   
        });

        it('should return 400 status as data is incorrect', (done) => {
            logAvengerIn('antman', function(agent){
                agent.post('/api/crewing/update-prices')
                    .send({
                            crewing_id: jetStar._id,
                            prices: [
                                {
                                    vehicle: 'Sedan',
                                    price: 112
                                },
                                {
                                    vehicle: 'Minibus',
                                    max_crew: 12,
                                    price: 350
                                }
                            ]
                    })
                    .end(function (err, res) {
                        console.log('YAH ', res.body);
                        CrewingDefault.findOne({}, function(err, crewDefault){
                            res.should.have.status(400);
                            done();
                        });
                    });
            });   
        });

        it('should create and return 200 status', (done) => {
            logAvengerIn('antman', function(agent){
                agent.post('/api/crewing/update-prices')
                    .send({
                            crewing_id: jetStar._id,
                            prices: [
                                {
                                    vehicle: 'Sedan',
                                    max_crew: 8,
                                    price: 112
                                },
                                {
                                    vehicle: 'Minibus',
                                    max_crew: 12,
                                    price: 350
                                }
                            ]
                    })
                    .end(function (err, res) {
                        CrewingDefault.findOne({}, function(err, crewDefault){
                            res.should.have.status(200);
                            crewDefault.name.should.equal('Jetstar');
                            crewDefault.pricing[1].max_crew.should.equal(12);
                            done();
                        });
                    });
            });   
        });

    });

    describe('POST /api/crewing/update-notes', () => {

        let jetStar;

        beforeEach((done) => {
            createJetstar(function(hmm){
                jetStar = hmm;
                done();
            });
        });

        afterEach((done) => {
            CrewingDefault.remove({}, function(err){
                Account.remove({}, function(err){
                    done();
                });
            });
        });

        // no on logged in
        it('should return 401 as no one is logged in', (done) => {
            testStatus(null, 401, '/api/crewing/update-notes', done);
        });

        // logged in without permission
        it('should return 403 as tony has no permission to access crewing', (done) => {
            testStatus('tony', 403, '/api/crewing/update-notes', done);
        });

        // logged in with permission
        it('should update notes and note should exist', (done) => {
            logAvengerIn('antman', function(agent){
                agent.post('/api/crewing/update-notes')
                    .send({
                            crewing_id: jetStar._id,
                            note: 'Do the thing' 
                    })
                    .end(function (err, res) {
                        CrewingDefault.findOne({}, function(err, crewDefault){
                            res.should.have.status(200);
                            crewDefault.name.should.equal('Jetstar');
                            crewDefault.default_note.should.equal('Do the thing');
                            done();
                        });
                    });
            });
        });

    });

});