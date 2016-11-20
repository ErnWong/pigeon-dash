var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

var parse = require('./parser');
var utils = require('./utils');
var mock = require('./mock');
var info = utils.info;
var error = utils.error;

var openPorts = new Map();

function available(cb) {
  serialport.list(function(err, ports) {
    if (err) cb(err);
    ports.push(mock.info);
    ports = ports.filter(function(port) {
      return !openPorts.has(port.comName);
    });
    cb(err, ports);
  });
}

function open(path, socket, cb) {
  available(function(err, ports) {
    var port = ports.find(function(port) {
      return port.comName == path;
    });
    if (!port) {
      var err = new Error('Opening unavailable port: ' + path);
      cb(err);
    }
    var sp;
    if (path === mock.info.comName) {
      sp = mock.open();
    }
    else {
      sp = new SerialPort(path, {
        baudrate: 115200,
        parser: serialport.parsers.readline('\n')
      });
    }
    openPorts.set(path, sp);
    connect(sp, socket);
    cb();
  });
}

function close(path) {
  var sp = getPort(path, 'Closing');
  sp.close(function(err) {
    if (err) {
      error('Port failed to close: ' + err);
    }
  });
}

function write(path, msg) {
  var sp = getPort(path, 'Writing');
  console.log("Writing to path:", path);
  console.log("Message:", msg);
  console.log("sp:", sp);
  sp.write(msg, function(err) {
    if (err) {
      error('Port failed to write: ' + err);
    }
  });
}

function getPort(path, action) {
  var sp = openPorts.get(path);
  if (!sp) {
    var err = new Error(action + ' unopened port:' + path);
    error(err);
    return;
  }
  return sp;
}

function connect(sp, socket) {

  sp.on('open', function(err) {
    if (err) {
      error('Port failed to open: ' + err);
      openPorts.delete(sp.path);
      return;
    }
    info('Port opened: ' + sp.path);

    sp.on('data', function(data) {
      var info = parse(data);
      socket.emit('port-data', info);
    });

  });

  sp.on('close', function() {
    info('Port closed: ' + sp.path);
    openPorts.delete(sp.path);
    socket.emit('port-close');
  });

  sp.on('error', function(err) {
    error('Port error: ' + err);
  });
}

module.exports = {
  available: available,
  open: open,
  close: close,
  write: write
};
