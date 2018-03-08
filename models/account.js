'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AccountSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    abn: {
        type: String,
        required: true,
        trim: true
    },
    lookup: {
        type: String,
        required: true,
        unique: true,
    },
    parent_account: {
        type: String,
    },
    account_category: {
        type: String,
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
    contact_details: [{
        primary_phone: String,
        primary_email: String,
        confirmation_phone: String,
        confirmation_email: String,
        accounts_phone: String,
        accounts_email: String
    }],
    default_notes: [{
        booking_note: String,
        office_note: String,
        driver_note: String
    }],
    pricing: [{
        current_ratesheet: String,
        airport_fee: Boolean,
        after_hours: Boolean,
        cancellation_period: Number
    }],
    invoicing: [{
        invoice_cycle: Number,
        stop_credit: Boolean
    }],
    status: {
        type: Boolean,
        required: true
    },
    created_at: Date
});

AccountSchema.pre('save', function(next){

    var now = new Date();
 
    if(this.isNew) {
        this.created_at = now;
    }

    next();

});

var Account = mongoose.model("Account", AccountSchema);
module.exports.Account = Account;