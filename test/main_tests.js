
var expect = require('chai').expect;
var request = require('supertest');

// Test suite

var server;
beforeEach(function () {
	server = require('../app.js');
});
afterEach(function () {
	server.close();
});

describe('server', function(){

	// Test Spec (Unit Test)
	it('should respond to /', function testThing(done){
		
		request(server).get('/').expect(200, done);

	});

});