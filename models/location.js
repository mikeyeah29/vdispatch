var Suburb = require('./suburb').Suburb;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var locationData = require('./data/locations.json');
// var async = require('async');

var LocationSchema = new Schema(
	{
        line1: {
            type: String,
            unique: true
        },
        line2: String,
        suburb: {
            type: Schema.Types.ObjectId,
            ref: 'Suburb'
        },
        city: String,
        state: String
	}
);

var Locaton = mongoose.model('Location', LocationSchema);

Locaton.find({line1: 'Cairns International Airport'}).exec(function(err, locations){

    if(err){
        return next(err);
    }

    if(!locations || locations == ''){

        Suburb.findOne({ suburb: 'Cairns City' }).exec(function(err, suburb){

            if(err){
                return next(err);
            }

            const international = new Locaton({ line1: 'Cairns International Airport', suburb: suburb });
            const domestic = new Locaton({ line1: 'Cairns Domestic Airport', suburb: suburb });

            Promise.all([international.save(), domestic.save()]);

        });

    }

});

//         var Suburb = require('./suburb');
//         var aeroglenId, parramattaParkId, earlvilleId;

//         Suburb.find({suburb: 'Aeroglen'}, (err, aeroglen) => {
//             Suburb.find({suburb: 'Parramatta Park'}, (err, parramattaPark) => {
//                 Suburb.find({suburb: 'Earlville'}, (err, earlville) => {

//                     async.each(locationData, 
//                         function(locData, callback) {



//                         },
//                         function(err){

//                         }
//                     );

//                 });
//             });
//         });

//         Locaton.insertMany(locationData)
//             .then(function(locations) {
//                 console.log('Yeah!');
//             })
//             .catch(function(err) {
//                 console.log('Err ', err);
//             });

//     }



module.exports.Locaton = Locaton;