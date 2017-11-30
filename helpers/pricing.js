const Account = require('../models/account').Account;
const Rate = require('../models/ratesheet').Rate;
const Locaton = require('../models/location').Locaton;

var exports = {};

function calculatePrice(accountName, pickUp, dropOff, callback){

	Account.findOne({name: accountName})
		.then((account) => {

			if(!account){
				var err = new Error();
				err.message = 'Could Not Find Account ' + accountName;
				callback(err, null);	
			}

			const rateSheet = account.pricing[0].current_ratesheet; // name
			
			Rate.findOne({name: rateSheet})
				.then((rate) => {

					if(!rate){
						var err = new Error();
						err.message = 'Account ' + accountName + ' has no rate sheet';
						return callback(err, null);
					}

					Locaton.findById(pickUp).populate('suburb')
						.then((pickUpLoc) => {

							Locaton.findById(dropOff).populate('suburb')
								.then((dropOffLoc) => {

									const puZone = pickUpLoc.suburb.zone;
									const doZone = dropOffLoc.suburb.zone;

									let priceFromRates = false;

									if(puZone == 'C1' || puZone == 'N4' || puZone == 'N5'){
										priceFromRates = 'Pick Up Zone';
									}

									if(doZone == 'C1' || doZone == 'N4' || doZone == 'N5'){
										priceFromRates = 'Drop Off Zone';
									}

									if(!priceFromRates){
										return callback(new Error('calculate manually'), null);
									}

									if(priceFromRates == 'Pick Up Zone'){
										return callback(null, rate[puZone]);
									}

									if(priceFromRates == 'Drop Off Zone'){
										return callback(null, rate[doZone]);
									}

								})
								.catch((err) => {
									return callback(err, null);
								});

						})
						.catch((err) => {
							return callback(err, null);
						});

				})
				.catch((err) => {
					return callback(err, null);
				});

			// Rate.getPrice();

		})
		.catch((err) => {
			return callback(err, null);
		});
	
}

exports.calculatePrice = calculatePrice;
module.exports = exports;