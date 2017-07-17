'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DriverSchema = new Schema(
	{
		first_name: {
			type: String,
			required: true,
			trim: true
		},
		last_name: {
			type: String,
			required: true,
			trim: true
		},
        dob: {
			type: Date,
			required: true
		},
		address: [{
			line1: String,
			line2: String,
            suburb: String,
            postcode: String
		}],
        email: {
            type: String,
            unique: true,
            required: true
        },
        phone: String,
        driver_code: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        driver_type: {
            type: String,
            required: true
        },
        driver_authorisation: [{
            da_number: String,
            da_expiry: Date,
            da_scan: String
        }],
        driver_licence: [{
            dl_number: String,
            dl_expiry: Date,
            dl_scan: String
        }],
		payment_details: [{
            abn: String,
            account: String,
            bsb: String
        }],
        color: String,
        status: {
            type: Boolean,
            required: true
        }
	}
);

var Driver = mongoose.model('Driver', DriverSchema);
module.exports.Driver = Driver;

