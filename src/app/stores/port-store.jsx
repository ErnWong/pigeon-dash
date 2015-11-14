var EventEmitter = require('events').EventEmitter;
var DashDispatcher = require('../dispatcher/dash-dispatcher');
var ActionTypes = require('../constants/action-types');

var available = [];
var loading = true;
var opening = false;
var selected = '';

var PortStore = new EventEmitter();

PortStore.emitChange = function() {
  this.emit('change');
}
PortStore.addChangeListener = function(listener) {
  this.on('change', listener);
}
PortStore.removeChangeListener = function(listener) {
  this.removeListener('change', listener);
}
PortStore.getAvailable = function() {
  return available;
};
PortStore.isLoading = function() {
  return loading;
};
PortStore.isOpening = function() {
  return opening;
};
PortStore.getSelected = function() {
  return selected;
};

DashDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.SELECT_PORT:
      selected = action.selection;
      opening = true;
      PortStore.emitChange();
      break;
    case ActionTypes.RECEIVE_PORT_LIST:
      loading = false;
      available = action.ports;
      PortStore.emitChange();
      break;
    case ActionTypes.RECEIVE_PORT_OPEN:
      opening = false;
      PortStore.emitChange();
      break;
  }
});

module.exports = PortStore;
