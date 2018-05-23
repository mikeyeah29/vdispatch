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
		customer: {
            type: Schema.Types.ObjectId,
            ref: 'Account'
        },
        sub_customer: {
            type: Schema.Types.ObjectId,
            ref: 'Account'
        },
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
            driver: {
                type: Schema.Types.ObjectId,
                ref: 'Driver'
            },
            vehicle: {
                type: Schema.Types.ObjectId,
                ref: 'Vehicle'
            }
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
	},
    {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true 
        }
    }
);

BookingSchema.virtual('date_nice').get(function(){

    if(!this.date){
        return '';
    }

    var dd = this.date.getDate();
    var mm = this.date.getMonth()+1; //January is 0!
    var yyyy = this.date.getFullYear();

    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    } 

    return dd+'/'+mm+'/'+yyyy;

});

BookingSchema.plugin(autoIncrement.plugin, {
    model: 'Booking',
    field: 'booking_no',
    startAt: 2000,
    incrementBy: 1
});

var Booking = mongoose.model('Booking', BookingSchema);
module.exports.Booking = Booking;