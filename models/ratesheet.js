/*HOW TO ADD IN EACH VEHICLE TYPE. NEW DOCUMENT?*/
var mongoose = require('mongoose');
var moment = require('moment');

// var createZoneObjs = require('../helpers/main.js').createZoneObjs;

var RateSheetSchema = new mongoose.Schema(
	{
		name: {
            type: String,
            unique: true
        },
        ratecode: String,
        discount_percent: Number,
        C1: Array,
        N4: Array,
        N5: Array,
        valid_from: Date,
        valid_to: Date,
        hourly: {
            sedan: Number,
            peoplemover: Number,
            minibus: Number,
            coaster: Number,
            stretch: Number
        },
        created_at: Date
        //  N5: [{
        //     zone: String,
        //     sedan: Number,
        //     peoplemover: Number,
        //     minibus: Number,
        //     coaster: Number,
        //     stretch: Number
        // }]
	}
);

RateSheetSchema.statics.getPrice = function(vehicle, from, to, callback){

    
    
};

RateSheetSchema.statics.makeObjFromCsv = function(csvData){
    
    const infoObj = csvData[1];
    const hoursObj = csvData[5];
    let discount = '';
    if(infoObj.Sedan){
        discount = infoObj.Sedan.replace('%', '');
    }

    const rateSheetObj = {
        name: infoObj.Zone,
        ratecode: infoObj.Suburb,
        discount_percent: discount, // remove %
        valid_from: moment(infoObj.Coaster, 'DD/MM/YYYY', true).format(),
        valid_to: moment(infoObj.Stretch, 'DD/MM/YYYY', true).format(),
        C1: csvData.slice(10, 35),
        N4: csvData.slice(39, 64),
        N5: csvData.slice(68, 93),
        hourly: {
            sedan: hoursObj.Sedan,
            peoplemover: hoursObj.PeopleMover,
            minibus: hoursObj.Minibus,
            coaster: hoursObj.Coaster,
            stretch: hoursObj.Stretch
        }
    }

    return rateSheetObj;

};

RateSheetSchema.pre('save', function(next){

    var now = new Date();
 
    if(this.isNew) {
        this.created_at = now;
    }

    next();

});

RateSheetSchema.statics.createRateSheetWithCsv = function(csvData, callback){

    let rateSheetObj = this.makeObjFromCsv(csvData);

    // add a new ratesheet
    RateSheet.create(rateSheetObj, function(err, rateSheet){

        var error = null;

        if(err){
            if(err.code == 11000){
                error = 'There is allready a ratesheet with that that name, edit csv and try again';
            }else{
                error = err.errmsg || 'Something went wrong';
            }
        }

        RateSheet.find({})
            .sort({created_at: -1})
            .select({name: 1, ratecode: 1, discount_percent: 1}).exec(function(err, ratesheets){

            callback(error, ratesheets);

        });

    });

};

RateSheetSchema.statics.updateRateSheetWithCsv = function(csvData, id, callback){

    let rateSheetObj = this.makeObjFromCsv(csvData);
    var error = null;

    RateSheet.update(
        {
            "_id": id
        }, 
        {
            $set: rateSheetObj
        },
        function(err, affected){

            if(err){
                console.log(err);
                error = err;
            }
                
            if(affected.n < 1){
                error = 'Update Failed';
            }

            RateSheet.findById(id).exec(function(err, rate){

                if(err){
                    error = err;
                }

                callback(error, rate);

            });

        }
    );

};

var RateSheet = mongoose.model('Rate', RateSheetSchema);
module.exports.RateSheet = RateSheet;


// n11: Number,
// n10: Integer,
// n9: Integer,
// n8: Number,
// n7: Integer,
// n6: Integer,
// n5: Integer,
// n4: Integer,
// n3: Integer,
// n2: Integer,
// n1: Integer,
// c1: Integer,
// c2: Integer,
// s1: Integer,
// s2: Integer,
// s3: Integer,
// s4: Integer,
// s5: Integer,
// s6: Integer,
// s7: Integer,
// t1: Integer,
// t2: Integer,
// t3: Integer,
// t4: Integer,
// t5: Integer,
