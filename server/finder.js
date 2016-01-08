
'use strict';
var sqldb  = require('./sqldb');
var Record = sqldb.Record;
var Tail = require('tail').Tail;
var userArgs = process.argv.slice(2);

if (!userArgs[0]) {
  console.error('Must provide logprefix');
  process.exit(1);
}
var tail = new Tail('/var/log/spanning/'+userArgs[0]+'.log');
sqldb.sequelize.sync()
  .then(function() {
    console.log('sync complete');
  });


tail.on("line", function(data) {
  if (data && data.indexOf('REQUEST_AUDIT') !== -1) {
    var jsonData = JSON.parse(data);
    console.log(jsonData);
    Record.create({
      name: jsonData.name,
      info: jsonData.msg
    })
      .then(function() {
        console.log('added');
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});

tail.on("error", function(error) {
  console.log('ERROR: ', error);
});
