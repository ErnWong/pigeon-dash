var io = require('socket.io-client');
var socket = io();
var EventEmitter = require('events').EventEmitter;
var PortActions = require('../actions/port-actions');
var ServerEvents = require('../constants/server-events');

var listeningId = null;

var Server = new EventEmitter();

Server.openPort = function(comName) {
  socket.emit('open-port', comName);
};
Server.requestPorts = function() {
  socket.emit('list-ports');
};
Server.startListening = function() {
  listeningId = setInterval(this.requestPorts, 2000);
};
Server.stopListening = function() {
  if (listeningId === null) return;
  clearInterval(listeningId);
  listeningId = null;
};

socket.on('port-list', function(ports) {
  Server.emit(ServerEvents.PORT_LIST, ports);
});

socket.on('port-opened', function() {
  Server.emit(ServerEvents.PORT_OPENED);
});

socket.on('port-closed', function() {
  Server.emit(ServerEvents.PORT_CLOSED);
});

module.exports = Server;
