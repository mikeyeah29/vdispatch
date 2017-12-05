/*NEED TO BE ABLE TO ADD MULTIPLE VEHICLES. NEW DOCUMENT?*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CrewingDefaultSchema = new Schema(
	{
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
            unique: true
        },
        name: String,
        hotel: {
            type: Schema.Types.ObjectId,
            ref: 'Location'
        },
        pricing: [{
            vehicle: {
                type: Schema.Types.ObjectId,
                ref: 'VehicleType'
            },
            max_crew: Number,
            price: Number
        }],
		default_note: String
	}
);

var CrewingDefault = mongoose.model('CrewingDefault', CrewingDefaultSchema);
module.exports.CrewingDefault = CrewingDefault;

