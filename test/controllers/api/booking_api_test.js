process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../../../models/user').User;
let VehicleType = require('../../../models/vehicle_type').VehicleType;
let Vehicle = require('../../../models/vehicle').Vehicle;
let Booking = require('../../../models/booking').Booking;
let Account = require('../../../models/account').Account;
let Suburb = require('../../../models/suburb').Suburb;
let Locaton = require('../../../models/location').Locaton;
let CrewingDefault = require('../../../models/crewing_default').CrewingDefault;

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../app');
let should = chai.should();
let expect = chai.expect();
let userTestData = require('../../data/users.json');
//let bookingTestData = require('../../data/bookings.json');
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

    var jetStarAccount;
    var cairnsCity;
    var loc1, loc2, loc3;
    var nick, tony, antman;
    var sedan;
    var jetStar;
    var rateSheet;

    var bookingObj = {};
    var crewingBookingObj = {};

    before(function(done){

        // rateSheet = new RateSheet();

        // jetStarAccount = new Account({
        //     name: 'Jet Star',
        //     abn: 'Anjk kj',
        //     lookup: 'jetstar',
        //     account_category: 'Crewing',
        //     pricing: [{
        //         current_ratesheet: rateSheet,
        //         airport_fee: true,
        //         after_hours: false
        //     }],
        //     status: true
        // });

        cairnsCity = new Suburb({
            suburb: "Cairns City",
            postcode: 4870,
            zone: 2,
            latlong: "-16.917922, 145.780589"
        });

        loc1 = new Locaton({ line1: 'The Hotel', line2: 'hmm yeah', suburb: cairnsCity._id });
        loc2 = new Locaton({ line1: 'Airport', line2: 'cdmkslcmkdsl', suburb: cairnsCity._id });
        loc3 = new Locaton({ line1: 'Somewhere', line2: 'yeah jkns', suburb: cairnsCity._id });

        nick = new User(userTestData[0]);
        tony = new User(userTestData[1]);
        antman = new User(userTestData[2]);

        sedan = new VehicleType({
            name: 'sedan',
            code: 5466,
            type: {
                make: 'Ford',
                model: 'Fiesta'
            },
            features: {
                seats: 6,
                suitcases: 4,
                carry_on: 3,
                image: '/img/mkdlmk.png'
            },
            details: {
                service_km: '204000',
                fuel_type: 'Petrol'
            }
        });

        jetStar = new CrewingDefault({
            name: 'JetStar',
            hotel: loc3,
            pricing: [
                {
                    vehicle: 'Sedan',
                    max_crew: 6,
                    price: 100
                },
                {
                    vehicle: 'Minibus',
                    max_crew: 15,
                    price: 300
                }
            ],
            default_note: 'Yeah notes! Woo'
        });

        bookingObj = {
            customer: 'Mark Twain',
            sub_customer: 'Bob Twain',
            reference1: 'yeah anjks kj',
            reference2: 'hobahabahay',
            reference3: 'jkndjkcdn',
            passengers: {
                name: 'Bill Murry',
                adults: 2,
                children: 3,
                infants: 1,
                email: 'bill@murry.com',
                phone: '09889746308'
            },
            vehicle_type: sedan._id,
            pick_up: {
                locaton: loc1,
                instructions: 'dklcmdslkcmkl klcds'
            },
            drop_off: {
                locaton: loc2,
                instructions: 'mskl klcds cklsdmc'
            },
            date: new Date('2018-03-25'),
            time: '13:00',
            transfer_type: 'Private',
            flight: '',
            extras: {
                water: 1,
                face_towel: 0,
                rear_seat: 1,
                forward_seat: 1,
                booster: 0
            },
            notes: {
                office: 'Dont do the thing',
                customer: ''
            }
        };

        crewingBookingObj = {
            customer: jetStar._id,
            bookings: [
                {
                    flight: '67HYT',
                    flightType: 'Domestic',
                    arrival: true,
                    tech: 3,
                    cabin: 5,
                    date: '2018-01-01',
                    time: '14:30'
                },
                {
                    customer: jetStar._id,
                    flight: '98HYT',
                    flightType: 'International',
                    arrival: false,
                    tech: 4,
                    cabin: 1,
                    date: '2018-03-22',
                    time: '10:15'
                }
            ]
        };

        Promise.all([cairnsCity.save(), loc1.save(), loc2.save(), loc3.save(), 
                sedan.save(), jetStar.save()])
            .then(() => { done(); })
            .catch((err) => { console.log('err ', err); });

        // suburb
        // locations
        // users
        // vehcile type
        // bookingObj
        // crewing dfault
        // crewing booking obj

    });

    after(function(done){
        
        Promise.all([
                Suburb.remove({}),
                Locaton.remove({}),
               // User.remove({}),
                VehicleType.remove({}),
                Booking.remove({}),
                CrewingDefault.remove({})
            ])
            .then(() => {
                done();
            });

    });

	describe('POST /api/bookings/create-booking', () => {

        after(function(done){
            Booking.remove({}, function(err){
                done();
            }); 
        });
		
        it('should return 401 as no one is logged in', (done) => {

            chai.request(server)
                .post('/api/bookings/create-booking')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });

        });

        it('should return 403 as tony has no permission to access bookings', (done) => {

            logAvengerIn('tony', function(agent){

                agent.post('/api/bookings/create-booking')
                    .send(bookingObj)
                    .end(function (err, res) {
                        res.should.have.status(403);
                        done();
                    });

            });

        });

        it('should create a booking and return a status of 200', (done) => {

            logAvengerIn('antman', function(agent){

                agent.post('/api/bookings/create-booking')
                    .send(bookingObj)
                    .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });

            });

        });

	});

    describe('POST /api/bookings/crewing-booking', () => {

        after(function(done){
            Booking.remove({}, function(err){
                done();
            }); 
        });
        
        it('should return 401 as no one is logged in', (done) => {

            chai.request(server)
                .post('/api/bookings/crewing-booking')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });

        });

        it('should return 403 as tony has no permission to access bookings', (done) => {

            logAvengerIn('tony', function(agent){

                agent.post('/api/bookings/crewing-booking')
                    .send(crewingBookingObj)
                    .end(function (err, res) {
                        res.should.have.status(403);
                        done();
                    });

            });

        });

        it('should return 200 as crewing booking has been created', (done) => {

            logAvengerIn('antman', function(agent){

                agent.post('/api/bookings/crewing-booking')
                    .send(crewingBookingObj)
                    .end(function (err, res) {
                        // console.log('res ', res.body);
                        res.should.have.status(200);
                        done();
                    });

            });

        });

        it('name should format correctly', (done) => {

            logAvengerIn('antman', function(agent){

                agent.post('/api/bookings/crewing-booking')
                    .send(crewingBookingObj)
                    .end(function (err, res) {

                        Booking.find({}).sort({'tech': 1}).exec(function(err, bookings){

                            bookings[0].passengers.name.should.equal('67HYT 3 TECH 5 CABIN');
                            bookings[1].passengers.name.should.equal('4 TECH 1 CABIN');
                            done();

                        });
                        
                    });

            });

        });

        it('adults should equal tech and cabin', (done) => {

            logAvengerIn('antman', function(agent){

                agent.post('/api/bookings/crewing-booking')
                    .send(crewingBookingObj)
                    .end(function (err, res) {

                        Booking.find({}, function(err, bookings){
                            bookings[0].passengers.adults.should.equal(8);
                            bookings[1].passengers.adults.should.equal(5);
                            done();
                        });
                        
                    });

            });

        });

        it('pickup should equal ', (done) => {

            logAvengerIn('antman', function(agent){

                agent.post('/api/bookings/crewing-booking')
                    .send(crewingBookingObj)
                    .end(function (err, res) {

                        Booking.find({}).sort({'tech': 1}).populate('pick_up.locaton')
                            .populate('drop_off.locaton').exec(function(err, bookings){

                            bookings[0].pick_up.locaton.line1.should.equal('Cairns Domestic Airport');
                            bookings[1].pick_up.locaton.line1.should.equal('Somewhere');
                            done();
                        });
                        
                    });

            });

        });

        it('dropoff should equal ', (done) => {

            logAvengerIn('antman', function(agent){

                agent.post('/api/bookings/crewing-booking')
                    .send(crewingBookingObj)
                    .end(function (err, res) {

                        Booking.find({}).sort({'tech': 1}).populate('pick_up.locaton')
                            .populate('drop_off.locaton').exec(function(err, bookings){
                            bookings[0].drop_off.locaton.line1.should.equal('Somewhere');
                            bookings[1].drop_off.locaton.line1.should.equal('Cairns International Airport');
                            done();
                        });
                        
                    });

            });

        });

    });

    describe('POST /api/booking/update-booking', () => {
        
    });

    describe('DELETE /api/booking/remove/:bookingId', () => {
        
    });

    // used for search, query string params will be used

    describe('GET /api/booking/search-bookings', () => {
        
    });

});