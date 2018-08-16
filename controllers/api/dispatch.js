'use strict';

const express = require('express');
const dispatchApi = express.Router();
const User = require('../../models/user.js').User;
const Account = require('../../models/account.js').Account;
const Booking = require('../../models/booking.js').Booking;
// const Locaton = require('../../models/location.js').Locaton;
const VehicleType = require('../../models/vehicle_type').VehicleType;
// const CrewingDefault = require('../../models/crewing_default').CrewingDefault;
const helper = require('../../helpers/main.js');
const mid = require('../../middlewares/index');

const routePermission = 'reservations';

// DISPATCH

// CHECK ROUTE PERMISSONS

dispatchApi.get('/', mid.requiresLoginJSON, function(req, res){



});

module.exports = dispatchApi;