/**
 * Main application file
 */

'use strict';

import configModule from 'config';
import child_process from 'child_process';
import express from 'express';
import sqldb from './sqldb';
import sys from 'sys';
import config from './config/environment';
import _ from 'lodash';
import http from 'http';

var Process = sqldb.Process;

// Populate databases with sample data
if (config.seedDB) { require('./config/seed'); }

var exec = child_process.exec;

// Setup server
var app = express();
var server = http.createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
function startServer() {
  server.listen(config.port, config.ip, function() {
    let portsFile = configModule.has('ports');

    let ports = configModule.get('ports')


    exec('lsof -i -n -P | grep TCP | grep LISTEN', function (error, stdout, stderr) {
      let lines = stdout.split('\n');
      lines.forEach(function(line) {
        _.forEach(ports, function(port, name) {
          if (_.isObject(ports[port])) {
            port = ports[port].app;
          }

          if (line.indexOf(':' + port + ' ') !== -1 ) {
            Process.create({
              name: name,
              info: port
            })
              .catch(function(err) {
                console.error(err);
                console.log('caught an error creating process');
              });

          }
        })
      });
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });



  });
}

sqldb.sequelize.sync()
  .then(startServer)
  .catch(function(err) {
    console.log('Server failed to start due to error: %s', err);
  });

// Expose app
exports = module.exports = app;
