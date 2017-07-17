'use strict';

const express = require('express');
const vehicles = express.Router();
const User = require('../models/user.js').User;
const Vehicle = require('../models/vehicle.js').Vehicle;

const routePermission = 'management';




module.exports = vehicles;

