'use strict';

var mongoose = require('mongoose');
var zoneData = require('./data/zones.json');

var Schema = mongoose.Schema;

var ZoneSchema = new Schema(
	{
		zone: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		locate_data: [{
            time: Number,
            distance: Number,
            tolls: Boolean
        }],
	}
);

var Zone = mongoose.model('Zone', ZoneSchema);

Zone.find({}).exec(function(err, zones){

    if(err){
        return next(err);
    }

    if(!zones || zones == ''){

        Zone.insertMany(zoneData)
            .then(function(zoneData) {
                console.log('Yeah!');
            })
            .catch(function(err) {
                console.log('Err ', err);
            });

    }else{
        console.log('zoneData ', zoneData);
    }

});

module.exports.Zone = Zone;

