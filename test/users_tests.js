
var expect = require('chai').expect;

// Test suite

describe('hasPermission', function(){

	// Test Spec (Unit Test)
	it('should return true', function(){

		var hasPermission = require('../helpers/main.js').hasPermission;

		var user = {
			name: 'mike',
			permissions: {
		        administrator: false,
		        management: true,
		        reservations: false,
		        operations: false,
		        accounts: false,
		        reports: false
		    }
		};

		expect(hasPermission(user, 'management')).to.be.true;

	});

	it('should return false', function(){

		var hasPermission = require('../helpers/main.js').hasPermission;

		var user = {
			name: 'mike',
			permissions: {
		        administrator: false,
		        management: false,
		        reservations: false,
		        operations: true,
		        accounts: false,
		        reports: false
		    }
		};

		expect(hasPermission(user, 'managment')).to.be.false;

	});

	it('should return false', function(){

		var hasPermission = require('../helpers/main.js').hasPermission;

		var user = '';

		expect(hasPermission(user, 'managment')).to.be.false;

	});

});