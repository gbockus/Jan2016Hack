/**
 * Sequelize initialization module
 */

'use strict';

//import path from 'path';
//import config from '../config/environment';
//import Sequelize from 'sequelize';
var path = require('path');
var config = require('../config/environment');
var Sequelize = require('sequelize');

var db = {
  Sequelize: Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below
db.Record = db.sequelize.import('../api/Record/Record.model');
db.Process = db.sequelize.import('../api/Process/Process.model');
db.Thing = db.sequelize.import('../api/thing/thing.model');

exports['default'] = db;
module.exports = exports['default'];
//export default db;
