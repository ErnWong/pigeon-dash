var EventEmitter = require('events').EventEmitter;
var socket = require('../socket');
var PortStore = new EventEmitter();

PortStore.ports = [];
PortStore.loading = true;

PortStore.getPorts = function() {
  return PortStore.ports;
};
PortStore.isLoading = function() {
  return PortStore.loading;
}

socket.on('port-list', function(ports) {
  PortStore.loading = false;
  PortStore.ports = ports;
  PortStore.emit('change');
});

setInterval(function() {
  socket.emit('list-ports');
}, 5000);

module.exports = PortStore;
