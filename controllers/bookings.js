'use strict';

const express = require('express');
const booking = express.Router();
const User = require('../models/user.js').User;
const helper = require('../helpers/main.js');

const routePermission = 'reservations';

module.exports = booking;