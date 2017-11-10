var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var locationData = require('./data/locations.json');

var LocationSchema = new Schema(
	{
        line1: {
            type: String,
            unique: true
        },
        line2: String,
        postcode: String,
        suburb: String
	}
);

var Locaton = mongoose.model('Location', LocationSchema);

Locaton.find({}).exec(function(err, locations){

    if(err){
        return next(err);
    }

    if(!locations || locations == ''){

        Locaton.insertMany(locationData)
            .then(function(locations) {
                console.log('Yeah!');
            })
            .catch(function(err) {
                console.log('Err ', err);
            });

    }

});

module.exports.Locaton = Locaton;