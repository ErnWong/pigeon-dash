var EventEmitter = require('events').EventEmitter;

var startTime = 0;
var interval;

var info = {
  comName: 'MOCK',
  manufacturer: 'For testing purposes'
};

var sp = new EventEmitter();
sp.close = function(cb) {
  clearInterval(interval);
  interval = null;
  setTimeout(function() {
    sp.emit('close');
    cb();
    sp.removeAllListeners();
  }, 0);
};
sp.write = function(msg, cb) {
  msg = msg.trim();
  switch (msg) {
    case 'stream.keys':
      sendMessage('stream.keys', 'sine squiggly noisy');
      break;
    case 'reckoner.keys':
      sendMessage('reckoner.keys', 'x y heading velocity');
      break;
  }
  setTimeout(function() {
    cb();
  }, 0);
};
sp.path = info.comName;

function open() {
  startTime = Date.now();
  interval = setInterval(tick, 40);
  setTimeout(function() {
    sp.emit('open');
  }, 0);
  return sp;
}

function tick() {
  var t = (Date.now() - startTime) / 1000;
  var sine = 5 * Math.sin(t);
  var squiggly = Math.sin(10 * t) + Math.sin(11 * t);
  var noisy = sine + 2 * (0.5 - Math.random());
  sendMessage('stream', [sine, squiggly, noisy].join(' '));

  var x = sine;
  var y = 6 * Math.cos(1.3 * t);
  var heading = (t + Math.PI) % (2 * Math.PI) - Math.PI;
  var velocity = sine;
  sendMessage('reckoner', [x, y, heading, velocity].join(' '));
}

function sendMessage(key, msg) {
  var data = '[' + getTimestamp() + '|' + key + '] ' + msg;
  sp.emit('data', data);
}

function getTimestamp() {
  var diff = Date.now() - startTime;
  var overpad = '00000000' + diff;
  return overpad.slice(-8);
}

module.exports = {
  info: info,
  open: open
};
