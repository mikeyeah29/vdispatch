'use strict';

var mongoose = require('mongoose');
var statusData = require('./data/statuses.json');

var Schema = mongoose.Schema;

var StatusSchema = new Schema(
	{
        status: String,
        dispatch_code: String,
        colour: String,
        description: String
	}
);

var Status = mongoose.model('Status', StatusSchema);

Status.find({}).exec(function(err, statuses){

    if(err){
        return next(err);
    }

    if(!statuses || statuses == ''){

        Status.insertMany(statusData)
            .then(function(statusData) {
                console.log('Yeah!');
            })
            .catch(function(err) {
                console.log('Err ', err);
            });

    }else{
        // console.log('pvars ', suburbs);
    }

});

module.exports.Status = Status;