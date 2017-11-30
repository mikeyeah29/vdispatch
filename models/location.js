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
        }
	}
);

var Locaton = mongoose.model('Location', LocationSchema);

Locaton.find({}).exec(function(err, locations){

    if(err){
        return next(err);
    }

    if(!locations || locations == ''){

        const international = new Locaton({ line1: 'Cairns International Airport' });
        const domestic = new Locaton({ line1: 'Cairns Domestic Airport' });

        Promise.all([international.save(), domestic.save()]);

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