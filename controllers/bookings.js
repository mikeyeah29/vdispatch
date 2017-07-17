'use strict';

const express = require('express');
const bookings = express.Router();
const User = require('../models/user.js').User;
const Booking = require('../models/booking.js').Booking;
const helper = require('../helpers/main.js');

const routePermission = 'reservations';



module.exports = bookings;