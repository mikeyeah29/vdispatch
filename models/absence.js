'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AbsenceSchema = new Schema({
	driver: {
		type: Schema.Types.ObjectId,
		ref: 'Driver'
	},
	startDate: Date, 
	endDate: Date
});

var Absence = mongoose.model('Absence', AbsenceSchema);
module.exports.Absence = Absence;