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

function createVehicles(done){

    VehicleType.remove({}, function(err){

        VehicleType.insertMany(vehicleTypeTestData)
            .then(function(vehicleTypeTestData) {
                
                VehicleType.find({'name': 'Sedan'}, function(err, vType){

                    let theVehicle = vehicleTestData[0];
                    theVehicle.type = vType._id;

                    Vehicle.remove({}, function(err){
                        Vehicle.create(theVehicle, function(err, vehicle){
                            done();
                        });
                    });

                });

            })
            .catch(function(err) {
                console.log('Err ', err);
            });

    });

}

describe('Vehicle Routes', () => {

    before(function(done){

        User.remove({}, function(err){
            let count = 0;
            async.each(userTestData, function(userData, callback) {
                User.create(userData, function(err, users){
                    count++;
                    if(count == userTestData.length){

                        createVehicles(done);

                    }else{
                        callback();
                    }
                });
            });
        });

    });

    describe('/GET /vehicles/overview', () => {

        it('should redirect to homepage as no one is logged in', (done) => {

            chai.request(server)
                .get('/vehicles/overview')
                .end((err, res) => {
                    res.should.redirect;
                    done();
                });

        });

        it('should redirect to homepage as Tony Stark is unauthorised to view vehicles', (done) => {

            logAvengerIn('tony', function(agent){

                agent.get('/vehicles/overview')
                    .end(function (err, res) {
                        res.should.redirect;
                        done();
                    });

            });

        });

        it('should render the vehicles overview page', (done) => {

            logAvengerIn('nick', function(agent){

                agent.get('/vehicles/overview')
                    .end(function (err, res) {
                        res.should.not.redirect;
                        // res.should.have.status(200);
                        done();
                    });

            });

        });

    });

    describe('/GET /vehicles/types', () => {

        it('should redirect to homepage as no one is logged in', (done) => {

            chai.request(server)
            .get('/vehicles/types')
            .end((err, res) => {
                res.should.redirect;
                done();
            });

        });

        it('should redirect to homepage as Tony Stark is unauthorised to view vehicles', (done) => {

            logAvengerIn('tony', function(agent){

                agent.get('/vehicles/types')
                    .end(function (err, res) {
                        res.should.redirect;
                        done();
                    });

            });

        });

        it('should render the vehicles types page', (done) => {

            logAvengerIn('nick', function(agent){

                agent.get('/vehicles/types')
                    .end(function (err, res) {
                        res.should.not.redirect;
                        res.should.have.status(200);
                        done();
                    });

            });

        });

    });

    describe('/GET /vehicles/types/create-type', () => {

        it('should redirect to homepage as no one is logged in', (done) => {

            chai.request(server)
            .get('/vehicles/types/create-type')
            .end((err, res) => {
                res.should.redirect;
                done();
            });

        });

        it('should redirect to homepage as Tony Stark is unauthorised to view vehicles', (done) => {

            logAvengerIn('tony', function(agent){

                agent.get('/vehicles/types/create-type')
                    .end(function (err, res) {
                        res.should.redirect;
                        done();
                    });

            });

        });

        it('should render the vehicles overview page', (done) => {

            logAvengerIn('nick', function(agent){

                agent.get('/vehicles/types/create-type')
                    .end(function (err, res) {
                        res.should.not.redirect;
                        res.should.have.status(200);
                        done();
                    });

            });

        });

    });

    describe('/POST /vehicles/types/create-type', () => {

        const minibusObj = {
            name: "Minibus",
            code: "mbus",
            type: {
                make: "Yellow",
                model: "Bus People"
            },
            features: {
                seats: 8,
                suitcases: 8,
                carry_on: 8,
                image: "/static/img/uploads/vehicles/bus.png"
            },
            details: {
                service_km: 20000,
                fuel_type: "Petrol"
            }
        };

        beforeEach(function(done){

            VehicleType.remove({'name': 'Minibus'}, function(err){
                done();
            });

        });

        it('should create a vehicle type of minibus with 8 seats by nick fury', (done) => {

            logAvengerIn('nick', function(agent){

                agent.post('/vehicles/types/create-type')
                    .send(minibusObj)
                    .end(function (err, res) {
                        
                        VehicleType.findOne({'name': 'Minibus'}, function(err, minibus){
                            minibus.features.seats.should.equal(8);
                            done();
                        });
                        
                    });

            });

        });

        it('should return an unauthorised error as no one is logged in', (done) => {

            chai.request(server)
                .post('/vehicles/types/create-type')
                .send(minibusObj)
                .end(function (err, res) {
                    
                    VehicleType.findOne({'name': 'Minibus'}, function(err, minibus){
                        should.not.exist(minibus);
                        done();
                    });
                    
                });

        });  

        it('should return unauthorised error as tony cant create vehicletypes', (done) => {

            logAvengerIn('tony', function(agent){

                agent.post('/vehicles/types/create-type')
                    .send(minibusObj)
                    .end(function (err, res) {
                        
                        res.should.have.status(403);
                        res.body.error.should.equal('unauthorised');
                        done();

                    });

            });

        });   

        it('should not have created the minibus vehicletype as tony cant create vehicletypes', (done) => {

            logAvengerIn('tony', function(agent){

                agent.post('/vehicles/types/create-type')
                    .send(minibusObj)
                    .end(function (err, res) {
                        
                        VehicleType.findOne({'name': 'Minibus'}, function(err, minibus){
                            should.not.exist(minibus);
                            done();
                        });
                        
                    });

            });

        });    

        it('should return error as Sedan already exists', (done) => {

            logAvengerIn('nick', function(agent){

                let sedanObj = minibusObj;
                sedanObj.name = 'Sedan';

                agent.post('/vehicles/types/create-type')
                    .send(sedanObj)
                    .end(function (err, res) {
                    
                        res.should.have.status(409);
                        res.body.error.should.equal('A vehicle type with the name Sedan already exists');
                        done();
                        
                    });

            });

        });     

    });

    describe('/GET /vehicles/types/edit/:typeId', () => {

        it('should redirect to homepage as no one is logged in', (done) => {

            VehicleType.findOne({'name': 'Sedan'}, function(err, sedan){

                chai.request(server)
                    .get('/vehicles/types/edit/' + sedan._id)
                    .end((err, res) => {
                        res.should.redirect;
                        done();
                    });

            });

        });

        it('should redirect to homepage as Tony Stark is unauthorised to view vehicles', (done) => {

            logAvengerIn('tony', function(agent){

                VehicleType.findOne({'name': 'Sedan'}, function(err, sedan){

                    agent.get('/vehicles/types/edit/' + sedan._id)
                    .end(function (err, res) {
                        res.should.redirect;
                        done();
                    });

                });

            });

        });

        it('should render the vehicles overview page', (done) => {

            logAvengerIn('nick', function(agent){

                VehicleType.findOne({'name': 'Sedan'}, function(err, sedan){

                    agent.get('/vehicles/types/edit/' + sedan._id)
                    .end(function (err, res) {
                        res.should.not.redirect;
                        res.should.have.status(200);
                        done();
                    });

                });

            });

        });

    });

    describe('/POST /vehicles/types/update', () => {

        let updateObj = {
            vehicleTypeId: null,
            name: "Sedan Yeah",
            code: "sss",
            type: {
                make: "Ford",
                model: "Fiesta"
            },
            features: {
                seats: 3,
                suitcases: 2,
                carry_on: 1,
                image: "/static/img/uploads/vehicles"
            },
            details: {
                service_km: 10000,
                fuel_type: "Petrol"
            }
        };

        beforeEach(function(done){

            const monsterTruckType = {
                name: "Monster Truck",
                code: "Med",
                type: {
                    make: "Ford",
                    model: "Fiesta"
                },
                features: {
                    seats: 4,
                    suitcases: 2,
                    carry_on: 1,
                    image: "/static/img/uploads/vehicles"
                },
                details: {
                    service_km: 10000,
                    fuel_type: "Petrol"
                }
            };

            VehicleType.create(monsterTruckType, function(err, monsterTruckType){

                if(!err){
                    updateObj.vehicleTypeId = monsterTruckType._id;
                    done();
                }else{
                    console.log(err);
                    done();
                }

            });

        });

        afterEach(function(done){

            VehicleType.remove({}, function(err) {
                done();
            });

        });

        it('should return unauthorised 401', (done) => {

                chai.request(server)
                .post('/vehicles/types/update')
                .send(updateObj)
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });

        });

        it('should return error of you do not have permission to update vehicle types', (done) => {

            logAvengerIn('tony', function(agent){

                VehicleType.findById(updateObj.vehicleTypeId, function(err, monsterTruck){

                    agent.post('/vehicles/types/update')
                        .send(updateObj)
                        .end(function (err, res) {
                            res.body.error.should.equal('you do not have permission to update vehicle types');
                            done();
                        });

                });

            });

        });

        it('should update Sedan and the updated Sedans seats should equal 3', (done) => {

            logAvengerIn('nick', function(agent){

                agent.post('/vehicles/types/update')
                    .send(updateObj)
                    .end(function (err, res) {
                        res.body.vehicletype.features.seats.should.equal(3);
                        done();
                    });

            });

        });

        it('should update Sedan and the updated Sedans code should equal sss', (done) => {

            logAvengerIn('nick', function(agent){

                agent.post('/vehicles/types/update')
                    .send(updateObj)
                    .end(function (err, res) {
                        res.body.vehicletype.code.should.equal('sss');
                        done();
                    });

            });

        });

        it('should update Sedan and the updated Sedans name should equal Sedan Yeah', (done) => {

            logAvengerIn('nick', function(agent){               

                agent.post('/vehicles/types/update')
                    .send(updateObj)
                    .end(function (err, res) {
                        res.body.vehicletype.name.should.equal('Sedan Yeah');
                        done();
                    });

            });

        });

        it('should have status 200', (done) => {

            logAvengerIn('nick', function(agent){

                agent.post('/vehicles/types/update')
                    .send(updateObj)
                    .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });

            });

        });

    });

    describe('/POST /vehicles/types/update-status', () => {

        var updateStatusObj = {
            vehicleTypeId: null,
            status: false
        };

        before(function(done){

            let vTypeObj = {
                name: "Stretch",
                code: "Str",
                type: {
                    make: "Thing",
                    model: "Thingymajigly"
                },
                features: {
                    seats: 10,
                    suitcases: 5,
                    carry_on: 5,
                    image: "/static/img/uploads/vehicles"
                },
                details: {
                    service_km: 10000,
                    fuel_type: "Petrol"
                }
            };

            VehicleType.create(vTypeObj, function(err, vType){

              //  console.log('when created ', vType);

                updateStatusObj.vehicleTypeId = vType._id;
                done();

            });

        });

        after(function(done){

            VehicleType.remove({}, function(err){
                done();
            });

        });

        it('should return unauthorised 401', (done) => {

            chai.request(server)
                .post('/vehicles/types/update-status')
                .send(updateStatusObj)
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });

        });

        it('should return 403 as tony cant update vehicletypes', (done) => {

            logAvengerIn('tony', function(agent){

                agent.post('/vehicles/types/update-status')
                    .send(updateStatusObj)
                    .end(function (err, res) {
                        res.should.have.status(403);
                        done();
                    });

            });

        });

        it('should update status to false', (done) => {

            logAvengerIn('nick', function(agent){

                agent.post('/vehicles/types/update-status')
                    .send(updateStatusObj)
                    .end(function (err, res) {
                        res.body.vehicletype.status.should.equal(false);
                        done();
                    });

            });

        });

        it('should update status to true', (done) => {

            logAvengerIn('nick', function(agent){

                updateStatusObj.status = true;

                agent.post('/vehicles/types/update-status')
                    .send(updateStatusObj)
                    .end(function (err, res) {
                        res.body.vehicletype.status.should.equal(true);
                        done();
                    });

            });

        });

    });

    describe('/GET /vehicles', () => {

        it('should redirect to homepage as no one is logged in', (done) => {

            chai.request(server)
            .get('/vehicles')
            .end((err, res) => {
                res.should.redirect;
                done();
            });

        });

        it('should redirect to homepage as Tony Stark is unauthorised to view vehicles', (done) => {

            logAvengerIn('tony', function(agent){

                agent.get('/vehicles')
                    .end(function (err, res) {
                        res.should.redirect;
                        done();
                    });

            });

        });

        it('should render the vehicles overview page', (done) => {

            logAvengerIn('nick', function(agent){

                agent.get('/vehicles')
                    .end(function (err, res) {
                        res.should.not.redirect;
                        res.should.have.status(200);
                        done();
                    });

            });

        });

    });

    describe('/GET /vehicles/create-vehicle', () => {

        it('should redirect to homepage as no one is logged in', (done) => {

            chai.request(server)
            .get('/vehicles/create-vehicle')
            .end((err, res) => {
                res.should.redirect;
                done();
            });

        });

        it('should redirect to homepage as Tony Stark is unauthorised to view vehicles', (done) => {

            logAvengerIn('tony', function(agent){

                agent.get('/vehicles/create-vehicle')
                    .end(function (err, res) {
                        res.should.redirect;
                        done();
                    });

            });

        });

        it('should render the vehicles overview page', (done) => {

            logAvengerIn('nick', function(agent){

                agent.get('/vehicles/create-vehicle')
                    .end(function (err, res) {
                        res.should.not.redirect;
                        res.should.have.status(200);
                        done();
                    });

            });

        });

    });

    describe('/POST /vehicles/create-vehicle', () => {

        const vehicle = {
            number: 20,
            year: 2017,
            color: 'Red',
            type: 'Sedan',
            vin: 'vin456',
            rego: 'rego8979',
            rego_expiry: new Date("2022-04-12"),
            coi_expiry: new Date("2019-03-25"),
            odometer: '200000'
        };

        afterEach(function(done){
            Vehicle.remove({}, function(err){
                done();
            });
        });

        it('should return 401 no one is logged in', (done) => {

            chai.request(server)
            .post('/vehicles/create-vehicle')
            .send(vehicle)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });

        });

        it('should return 403 as tony cant access vehicles', (done) => {

            logAvengerIn('tony', function(agent){

                agent.post('/vehicles/create-vehicle')
                    .send(vehicle)
                    .end(function (err, res) {
                        
                        res.should.have.status(403);
                        done();
                        
                    });

            });

        });

        it('should create vehicle with year 2017', (done) => {

            logAvengerIn('nick', function(agent){

                agent.post('/vehicles/create-vehicle')
                    .send(vehicle)
                    .end(function (err, res) {
                        
                        res.body.vehicle.year.should.equal(2017);
                        done();
                        
                    });

            });

        });

        it('should create vehicle with rego_expiry date as 2022-04-12', (done) => {

            logAvengerIn('nick', function(agent){

                agent.post('/vehicles/create-vehicle')
                    .send(vehicle)
                    .end(function (err, res) {
                        
                        new Date(res.body.vehicle.rego_expiry).getTime().should.equal(new Date("2022-04-12").getTime());
                        done();
                        
                    });

            });

        });

    });

    describe('/GET /vehicles/edit/:vehicleId', () => {

        let vehicleId = null;

        before(function(done){

            Vehicle.create({
                "number": 20,
                "year": 2005,
                "color": "Blue",
                "vin": "8789789",
                "rego": "TY5 YYHJ",
                "rego_expiry": "2019-04-23T18:25:43.511Z",
                "coi_expiry": "2019-09-23T18:25:43.511Z",
                "odometer": 440
            }, function(err, vehicle){
                vehicleId = vehicle._id;
                done();
            });

        });

        after(function(done){
            Vehicle.remove({}, function(err){
                done();
            });
        });

        it('should redirect to homepage as no one is logged in', (done) => {

            chai.request(server)
            .get('/vehicles/edit/' + vehicleId)
            .end((err, res) => {
                res.should.redirect;
                done();
            });

        });

        it('should redirect as tony is not allowed to view vehicles', (done) => {

            logAvengerIn('tony', function(agent){

                agent.get('/vehicles/edit/' + vehicleId)
                    .end(function (err, res) {
                        res.should.redirect;
                        done();
                    });

            });

        });

        it('should render the vehicles edit page', (done) => {

            logAvengerIn('nick', function(agent){

                agent.get('/vehicles/edit/' + vehicleId)
                    .end(function (err, res) {
                        res.should.not.redirect;
                        res.should.have.status(200);
                        done();
                    });

            });

        });

    });

    describe('/POST /vehicles/update-status', () => {

        var updateStatusObj = {
            status: false
        };

        before(function(done){

            Vehicle.create({
                "number": 20,
                "year": 2005,
                "color": "Blue",
                "vin": "8789789",
                "rego": "TY5 YYHJ",
                "rego_expiry": "2019-04-23T18:25:43.511Z",
                "coi_expiry": "2019-09-23T18:25:43.511Z",
                "odometer": 440
            }, function(err, vehicle){
                updateStatusObj.vehicleId = vehicle._id;
                done();
            });

        });

        after(function(done){
            Vehicle.remove({}, function(err){
                done();
            });
        });

        it('should return unauthorised 401', (done) => {

            chai.request(server)
                .post('/vehicles/update-status')
                .send(updateStatusObj)
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });

        });

        it('should return 403 as tony cant update vehicletypes', (done) => {

            logAvengerIn('tony', function(agent){

                agent.post('/vehicles/update-status')
                    .send(updateStatusObj)
                    .end(function (err, res) {
                        res.should.have.status(403);
                        done();
                    });

            });

        });

        it('should update status to false', (done) => {

            logAvengerIn('nick', function(agent){

                agent.post('/vehicles/update-status')
                    .send(updateStatusObj)
                    .end(function (err, res) {
                        res.body.vehicle.status.should.equal(false);                        
                        done();
                    });

            });

        });

        it('should update status to true', (done) => {

            logAvengerIn('nick', function(agent){

                updateStatusObj.status = true;

                agent.post('/vehicles/update-status')
                    .send(updateStatusObj)
                    .end(function (err, res) {
                        res.body.vehicle.status.should.equal(true);
                        done();
                    });

            });

        });

    });

    describe('/POST /vehicles/update', () => {

        let updateObj = {
            number: 10,
            year: 2014,
            color: "Green",
            vin: "8789789",
            rego: "TY5 YYHJ",
            rego_expiry: "2019-04-23T18:25:43.511Z",
            coi_expiry: "2019-09-23T18:25:43.511Z",
            odometer: 440
        };

        beforeEach(function(done){

            const vehicle = {
                number: 10,
                year: 2005,
                color: "Blue",
                vin: "8789789",
                rego: "TY5 YYHJ",
                rego_expiry: "2019-04-23T18:25:43.511Z",
                coi_expiry: "2019-09-23T18:25:43.511Z",
                odometer: 440
            };

            Vehicle.create(vehicle, function(err, vehicle){

                if(!err){
                    updateObj.vehicleId = vehicle._id;
                    done();
                }else{
                    console.log(err);
                    done();
                }

            });

        });

        afterEach(function(done){

            Vehicle.remove({}, function(err) {
                done();
            });

        });

        it('should return unauthorised 401', (done) => {

                chai.request(server)
                .post('/vehicles/update')
                .send(updateObj)
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });

        });

        it('should return error of you do not have permission to update vehicle', (done) => {

            logAvengerIn('tony', function(agent){

                VehicleType.findById(updateObj.vehicleTypeId, function(err, monsterTruck){

                    agent.post('/vehicles/update')
                        .send(updateObj)
                        .end(function (err, res) {
                            res.body.error.should.equal('you do not have permission to update vehicles');
                            done();
                        });

                });

            });

        });

        it('should update vehicle and year should equal 2014', (done) => {

            logAvengerIn('nick', function(agent){

                agent.post('/vehicles/update')
                    .send(updateObj)
                    .end(function (err, res) {
                        res.body.vehicle.year.should.equal(2014);
                        done();
                    });

            });

        });

        it('should update vehicle color should be green', (done) => {

            logAvengerIn('nick', function(agent){

                agent.post('/vehicles/update')
                    .send(updateObj)
                    .end(function (err, res) {
                        res.body.vehicle.color.should.equal('Green');
                        done();
                    });

            });

        });

        it('should have status 200', (done) => {

            logAvengerIn('nick', function(agent){

                agent.post('/vehicles/update')
                    .send(updateObj)
                    .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });

            });

        });

    });

});