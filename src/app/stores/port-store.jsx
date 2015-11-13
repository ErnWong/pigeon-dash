var EventEmitter = require('events').EventEmitter;
var socket = require('../socket');
var DashDispatcher = require('../dispatcher/dash-dispatcher');
var PortStore = new EventEmitter();

PortStore.ports = [];
PortStore.loading = true;
PortStore.opening = false;
PortStore.selected = '';

PortStore.getPorts = function() {
  return PortStore.ports;
};
PortStore.isLoading = function() {
  return PortStore.loading;
};
PortStore.isOpening = function() {
  return PortStore.opening;
};
PortStore.getSelected = function() {
  return PortStore.selected;
};

socket.on('port-list', function(ports) {
  PortStore.loading = false;
  PortStore.ports = ports;
  PortStore.emit('changed');
});

socket.on('port-opened', function() {
  PortStore.opening = false;
  PortStore.emit('changed');
});

function requestUpdate() {
  socket.emit('list-ports');
}
requestUpdate();
var updateInterval = setInterval(requestUpdate, 2000);

DashDispatcher.register(function(action) {
  switch (action.type) {
    case 'select-port':
      PortStore.selected = action.selection;
      PortStore.opening = true;
      clearInterval(updateInterval);
      socket.emit('open-port', action.selection);
      PortStore.emit('changed');
      break;
  }
});

module.exports = PortStore;
