var EventEmitter = require('events').EventEmitter;
var DashDispatcher = require('../dispatcher/dash-dispatcher');
var ActionTypes = require('../constants/action-types');
var PanelTypes = require('../constants/panel-types');
var PanelLogic = require('../utils/panel-logic');

var DashStore = new EventEmitter();

var _panels = [];
var _connected = false;

DashStore.emitChange = function() {
  this.emit('change');
};
DashStore.addChangeListener = function(listener) {
  this.on('change', listener);
};
DashStore.removeChangeListener = function(listener) {
  this.removeListener('change', listener);
};
DashStore.getPanels = function() {
  return _panels;
};
DashStore.isConnected = function() {
  return _connected;
};

DashDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.OPEN_PANEL:
      var panel = {
        type: action.panelType
      };
      _panels.push(panel);
      DashStore.emitChange();
      break;
    case ActionTypes.CLOSE_PANEL:
      var index = _panels.indexOf(action.panel);
      if (index === -1) break;
      _panels.splice(index, 1);
      DashStore.emitChange();
      break;
    case ActionTypes.RECEIVE_PORT_OPEN:
      _connected = true;
      DashStore.emitChange();
      break;
    case ActionTypes.RECEIVE_PORT_CLOSE:
      _connected = false;
      DashStore.emitChange();
      break;
  }
});

module.exports = DashStore;
