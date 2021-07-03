'use strict';
const ok = require('./ok');
const error = require('./error');
const unAuthorized = require('./unauthorized');
const created = require('./created');
const conflict = require('./conflict');
const interswitchError = require('./interswitch-error');
const flutterwaveError = require('./flutterwave-error');
const badRequest = require('./bad-request');
const notFound = require('./not-found');

module.exports = { ok, error, unAuthorized, created , conflict, interswitchError, flutterwaveError, badRequest, notFound };
