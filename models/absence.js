'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AbsenceSchema = new Schema({
	driver: {
		type: Schema.Types.ObjectId,
		ref: 'Driver',
		required: true
	},
	startDate: {
		type: Date,
		required: true
	}, 
	endDate: {
		type: Date,
		required: true
	}
});

AbsenceSchema.statics.addAbsence = function(absenceData, callback){

	var thisAbsence = this;

	this.create(absenceData, function(error, absence){

		if(error){
			return callback(error, null);
		}

		thisAbsence.find({}).populate('driver', ['color', '_id', 'first_name', 'last_name']).exec(function(err, absences){

			if(error){
				return callback(error, null);
			}
			return callback(null, absences);

		});

	});

};

var Absence = mongoose.model('Absence', AbsenceSchema);
module.exports.Absence = Absence;