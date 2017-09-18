'use strict';

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

var Schema = mongoose.Schema;

var VehicleSchema = new Schema({
    year: Number,
    color: String,
    type: {
        type: Schema.Types.ObjectId,
        ref: 'VehicleType',
    },
    vin: String,
    rego: String,
    rego_expiry: Date,
    coi_expiry: Date,
    dot_booking: Date,
    odometer: Number,
    status: {
        type: Boolean,
        required: true,
        default: true
    }
});

VehicleSchema.statics.sortVehicles = function(vehicles, property){

    vehicles.sort(function(a, b){
        if(a[property] < b[property])
            return -1;
        if(a[property] > b[property])
            return 1;
        return 0;
    });

};

VehicleSchema.plugin(autoIncrement.plugin, {
    model: 'Vehicle',
    startAt: 1
});
var Vehicle = mongoose.model('Vehicle', VehicleSchema);

module.exports.Vehicle = Vehicle;

