'use strict';

const express = require('express');
const accounts = express.Router();
const User = require('../models/user.js').User;
const helper = require('../helpers/main.js');

const routePermission = 'management';

module.exports = accounts;