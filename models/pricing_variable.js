var mongoose = require('mongoose');
var pvarDocuments = require('./data/pvars.json');

var Schema = mongoose.Schema;

var PricingVarSchema = new Schema(
    {
        name: String,
        price: Number,
        unit: String
    }
);

var PricingVariables = mongoose.model('PricingVariables', PricingVarSchema);
    
PricingVariables.find({}).exec(function(err, pvars){

    if(err){
        return next(err);
    }

    if(!pvars || pvars == ''){

        PricingVariables.insertMany(pvarDocuments)
            .then(function(pvarDocuments) {
                console.log('Yeah!');
            })
            .catch(function(err) {
                console.log('Err ', err);
            });

    }else{
        console.log('pvars ', pvars);
    }

});

module.exports.PricingVariables = PricingVariables;

