'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	created_at: {
		type: Date
	},
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
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
    phone: {
    	type: String,
    	trim: true
    },
	address: [{
		line1: String,
		line2: String,
        suburb: String,
        postcode: String
	}],
	payment_details: [{
		bank_name: String,
        account: String,
        bsb: String
    }],
    permissions: [{
        administrator: Boolean,
        management: Boolean,
        reservations: Boolean,
        operations: Boolean,
        accounts: Boolean,
        reports: Boolean
    }],
    status: {
        type: Boolean,
        required: true
    }
});

UserSchema.pre('save', function(next){
	var user = this;
	bcrypt.hash(user.password, 10, function(err, hash){
		
		if(err){
			return next(err);
		}

		user.password = hash;
		next();

	});
});

// Authenticate
UserSchema.statics.authenticate = function(email, password, callback){

	User.findOne({email: email}).exec(function(err, user){

		if(err){
			return callback(err);
		}else if(!user){
			var err = new Error('User not found');
			err.status = 401;
			return callback(err);
		}

		bcrypt.compare(password, user.password, function(err, result){

			if(result === true){
				return callback(null, user);
			}else{
				return callback();
			}

		});

	});

}

// UserSchema.statics.hasPermission = function(userId, permission){

// 	if(this.permissions[permission] == true){
// 		return true;
// 	}

// 	return false;

// };

var User = mongoose.model("User", UserSchema);
module.exports.User = User;