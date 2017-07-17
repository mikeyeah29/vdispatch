/*HOW TO ADD IN EACH VEHICLE TYPE. NEW DOCUMENT?*/
var mongoose = require('mongoose');

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
        N5: Array
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

RateSheetSchema.statics.makeObjFromCsv = function(csvData){
    
    const infoObj = csvData[1];

    const rateSheetObj = {
        name: infoObj.Zone,
        ratecode: infoObj.Suburb,
        discount_percent: infoObj.Sedan.replace('%', ''), // remove %
        C1: csvData.slice(6, 30),
        N4: csvData.slice(35, 59),
        N5: csvData.slice(64, 88)
    }

    return rateSheetObj;

};

RateSheetSchema.statics.createRateSheetWithCsv = function(csvData, callback){

    let rateSheetObj = this.makeObjFromCsv(csvData);

    // add a new ratesheet
    RateSheet.create(rateSheetObj, function(err, rateSheet){

        var error = null;

        if(err){
            error = err;
        }

        RateSheet.find({}).select({name: 1, ratecode: 1, discount_percent: 1}).exec(function(err, ratesheets){

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
