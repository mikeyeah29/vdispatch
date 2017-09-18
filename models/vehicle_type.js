'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VehicleTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    type: {
        make: String,
        model: String
    },
    features: {
        seats: Number,
        suitcases: Number,
        carry_on: Number,
        image: String
    },
    details: {
        service_km: String,
        fuel_type: String
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
});

var VehicleType = mongoose.model('VehicleType', VehicleTypeSchema);

module.exports.VehicleType = VehicleType;

