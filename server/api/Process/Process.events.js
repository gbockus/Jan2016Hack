/**
 * Process model events
 */

'use strict';

import {EventEmitter} from 'events';
var Process = require('../../sqldb').Process;
var ProcessEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProcessEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Process.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProcessEvents.emit(event + ':' + doc._id, doc);
    ProcessEvents.emit(event, doc);
    done(null);
  }
}

export default ProcessEvents;
