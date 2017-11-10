'use strict';

var mongoose = require('mongoose');
var citypairData = require('./data/citypairs.json');

var Schema = mongoose.Schema;

var FlightCityPairSchema = new Schema({
    city: String,
	icao: String,
    iata: String,
    name: String
});

var FlightCityPair = mongoose.model('Flight City Pair', FlightCityPairSchema);

FlightCityPair.find({}).exec(function(err, citypairs){

    if(err){
        return next(err);
    }

    if(!citypairs || citypairs == ''){

        FlightCityPair.insertMany(citypairData)
            .then(function(citypairs) {
                console.log('Yeah!');
            })
            .catch(function(err) {
                console.log('Err ', err);
            });

    }else{
      //  console.log('citypairs ', citypairs);
    }

});

module.exports.FlightCityPair = FlightCityPair;

