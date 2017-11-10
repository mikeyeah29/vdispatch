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
            location: String,
            line2: String,
            suburb: String,
            zone: String
        },
        pricing: [{
            vehicle: String,
            max_crew: Number,
            price: Number
        }],
		default_note: String
	}
);

var CrewingDefault = mongoose.model('CrewingDefault', CrewingDefaultSchema);
module.exports.CrewingDefault = CrewingDefault;

