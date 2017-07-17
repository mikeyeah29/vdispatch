/*NEED TO DO BOOKING NOTES + BOOKING REQ ATTN + TAGS*/
var mongoose = require('mongoose');
var BookingsSchema = new mongoose.Schema(
	{
		status: String,
		customer: String,
        reference1: String,
        reference2: String,
        reference3: String,
        passengers: [{
            passenger_name: String,
            pax_adults: Number,
            pax_children: Number,
            pax_infants: Number,
            passenger_email: String,
            passenger_phone: String,
        }],
        vehicle_type: String,
        transfer: [{
            date_time: Date,
        pick_up: [{
            location: String,
            suburb: String,
            zone: String
        }],
        drop_off: [{
            location: String,
            suburb: String,
            zone: String
        }],
        flight: String,
        allocation: [{
            driver: String,
            vehicle: String
        }],
        extras: [{
            water: Number,
            face_towel: Number,
            rear_seat: Number,
            forward_seat: Number,
            booster: Number
        }],
        invoiced: {
            type: Boolean,
            required: true
        },
	}
);

var Bookings = mongoose.model('Bookings', BookingsSchema);
module.exports = Bookings;

