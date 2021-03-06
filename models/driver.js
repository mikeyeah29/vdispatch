'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

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
            city: String,
            postcode: String,
            state: String
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
        driver_authorisation: {
            da_number: String,
            da_expiry: Date,
            da_scan: String
        },
        driver_licence: {
            dl_number: String,
            dl_expiry: Date,
            dl_scan: String
        },
		payment_details: [{
            abn: String,
            account: String,
            bsb: String
        }],
        color: String,
        status: {
            type: Boolean,
            required: true
        },
        created_at: Date
	}
);

DriverSchema.pre('save', function(next){
    var driver = this;
    var now = new Date();
 
    if(driver.isNew) {
        driver.created_at = now;
    }

    bcrypt.hash(driver.password, 10, function(err, hash){
        
        if(err){
            return next(err);
        }

        driver.password = hash;
        next();

    });
});

DriverSchema.statics.getExpiring = function(callback){

    var now = new Date();
    var threeMonthsFuture = new Date();
    threeMonthsFuture.setMonth(threeMonthsFuture.getMonth()+3);

    var findObj = {'status': true};

    this.find(findObj, function(err, drivers){

        if(err){
            return next(err);
        }

        var expiryArray = [];

        for(var i=0; i<drivers.length; i++) {

            if(drivers[i].driver_authorisation.da_expiry < threeMonthsFuture){
                expiryArray.push({
                    name: drivers[i].first_name + drivers[i].last_name,
                    type: 'Driver Authorisation',
                    expires: drivers[i].driver_authorisation.da_expiry.toLocaleDateString()
                });
            }

            if(drivers[i].driver_licence.dl_expiry < threeMonthsFuture){
                expiryArray.push({
                    name: drivers[i].first_name + drivers[i].last_name,
                    type: 'Driver Licence',
                    expires: drivers[i].driver_licence.dl_expiry.toLocaleDateString()
                });
            }

        }

        callback(null, expiryArray);

    });

};

var Driver = mongoose.model('Driver', DriverSchema);
module.exports.Driver = Driver;

