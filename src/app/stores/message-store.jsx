var EventEmitter = require('events').EventEmitter;
var DashDispatcher = require('../dispatcher/dash-dispatcher');
var ActionTypes = require('../constants/action-types');
var clipBuffer = require('../utils/message-clip');

var _messages = [];

var MAX_BUFFER_SIZE = 128;

var MessageStore = new EventEmitter();

MessageStore.emitChange = function() {
  this.emit('change');
};
MessageStore.addChangeListener = function(listener) {
  this.on('change', listener);
};
MessageStore.removeChangeListener = function(listener) {
  this.removeListener('change', listener);
};
MessageStore.getMessages = function() {
  return _messages;
}

MessageStore.dispatchToken = DashDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_PORT_DATA:
      _messages.push(action.data);
      clipBuffer(_messages, MAX_BUFFER_SIZE);
      MessageStore.emitChange();
      break;
  }
});

module.exports = MessageStore;
