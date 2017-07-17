'use strict';

var mongoose = require('mongoose');
var suburbData = require('./data/suburbs.json');

var Schema = mongoose.Schema;

var SuburbSchema = new Schema({
    suburb: String,
    postcode: String,
    zone: String
});

var Suburb = mongoose.model('Suburb', SuburbSchema);

Suburb.find({}).exec(function(err, suburbs){

    if(err){
        return next(err);
    }

    if(!suburbs || suburbs == ''){

        Suburb.insertMany(suburbData)
            .then(function(suburbData) {
                console.log('Yeah!');
            })
            .catch(function(err) {
                console.log('Err ', err);
            });

    }else{
       // console.log('pvars ', suburbs);
    }

});

module.exports.Suburb = Suburb;

