/*NEED TO DO BOOKING NOTES + BOOKING REQ ATTN + TAGS*/
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var Schema = mongoose.Schema;

var BookingSchema = new Schema(
	{
        booking_no: Number,
        isCrewing: {
            type: Boolean,
            default: false
        },
		status: {
            type: String,
            default: 'Confirmed'
        },
		customer: String,
        sub_customer: String,
        reference1: String,
        reference2: String,
        reference3: String,
        passengers: {
            name: String,
            adults: Number,
            children: Number,
            infants: Number,
            email: String,
            phone: String
        },
        vehicle_type: {
            type: Schema.Types.ObjectId,
            ref: 'VehicleType'
        },
        pick_up: {
            locaton: {
                type: Schema.Types.ObjectId,
                ref: 'Location'
            },
            instructions: String
        },
        drop_off: {
            locaton: {
                type: Schema.Types.ObjectId,
                ref: 'Location'
            },
            instructions: String
        },
        transfer_type: String,
        date: Date,
        time: String,
        flight: String,
        allocation: {
            driver: String,
            vehicle: String
        },
        extras: {
            water: Number,
            face_towel: Number,
            rear_seat: Number,
            forward_seat: Number,
            booster: Number
        },
        notes: {
            office: String,
            customer: String,
            driver: String
        },
        price: Number,
        invoiced: {
            type: Boolean,
            required: true,
            default: false
        }
	}
);

BookingSchema.plugin(autoIncrement.plugin, {
    model: 'Booking',
    field: 'booking_no',
    startAt: 2000,
    incrementBy: 1
});

var Booking = mongoose.model('Booking', BookingSchema);
module.exports.Booking = Booking;