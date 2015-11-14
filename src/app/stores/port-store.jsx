var EventEmitter = require('events').EventEmitter;
var DashDispatcher = require('../dispatcher/dash-dispatcher');
var ActionTypes = require('../constants/action-types');

var _available = [];
var _loading = true;
var _opening = false;
var _selected = '';

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
  return _available;
};
PortStore.isLoading = function() {
  return _loading;
};
PortStore.isOpening = function() {
  return _opening;
};
PortStore.getSelected = function() {
  return _selected;
};

DashDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.SELECT_PORT:
      _selected = action.selection;
      _opening = true;
      PortStore.emitChange();
      break;
    case ActionTypes.RECEIVE_PORT_LIST:
      _loading = false;
      _available = action.ports;
      PortStore.emitChange();
      break;
    case ActionTypes.RECEIVE_PORT_OPEN:
      _opening = false;
      PortStore.emitChange();
      break;
  }
});

module.exports = PortStore;
