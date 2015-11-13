var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var parser = require('./parser');
var utils = require('./utils');
var ports = require('./ports');
var info = utils.info;
var error = utils.error;


server.listen(80);
info('Serving dashboard at http://localhost:80/');

app.use(express.static('public'));

io.on('connection', function(socket) {
  info('New dashboard client connected');

  var port = '';

  socket.on('list-ports', function() {
    ports.available(function(err, ports) {
      socket.emit('port-list', ports);
    });
  });

  socket.on('open-port', function(path) {
    if (port) ports.close(port);
    ports.open(path, socket, function(err) {
      if (err) {
        socket.emit('open-error', err);
        return;
      }
      port = path;
      socket.emit('port-opened');
    });
  });

  socket.on('close-port', function() {
    if (!port) return;
    ports.close(port);
    port = '';
  });

  socket.on('send-command', function(command) {
    if (!port) return;
    ports.write(port, command.channel + ' ' + command.message);
  });

  socket.on('write-port', function(msg) {
    if (!port) return;
    ports.write(port, msg);
  });

  socket.on('disconnect', function() {
    info('A dashboard client disconnected');
    if (port) ports.close(port);
  });
});
