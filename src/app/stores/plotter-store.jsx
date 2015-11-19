var EventEmitter = require('events').EventEmitter;
var DashDispatcher = require('../dispatcher/dash-dispatcher');
var ActionTypes = require('../constants/action-types');
var MessageStore = require('../stores/message-store');

var _plotters = new WeakMap();

function addPlotter(panel) {
  _plotters.set(panel, {
    channel: '',
    keys: [],
    data: [],
    lastTimestamp: 0,
  });
}

function updateKey(plotter, message) {
  plotter.keys = message.message.split(' ');
}

function updateData(plotter) {
  var buffer = MessageStore.getMessages();

  // Accumulate new messages
  var i = buffer.length - 1;
  var newData = [];
  while (i >= 0) {
    var message = buffer[i]
    if (message.channel == plotter.channel + '.keys') {
      updateKey(plotter, message);
    }
    if (message.timestamp <= plotter.lastTimestamp) {
      break;
    }
    if (plotter.keys.length > 0 && message.channel == plotter.channel) {
      var values = message.message
        .split(' ')
        .map((str) => +str);
      if (values.length < plotter.keys.length) {
        values.fill(0, values.length, plotter.keys.length);
      }
      values.length = plotter.keys.length;
      values.unshift(message.timestamp);
      newData.unshift(values);
    }
    i--;
  }

  // Add new messages
  plotter.data.push.apply(plotter.data, newData);

  // Set last timestamp
  if (plotter.data.length > 0) {
    plotter.lastTimestamp = plotter.data[plotter.data.length - 1][0];
  }
}

var PlotterStore = new EventEmitter();

PlotterStore.emitChange = function() {
  this.emit('change');
};
PlotterStore.addChangeListener = function(listener) {
  this.on('change', listener);
};
PlotterStore.removeChangeListener = function(listener) {
  this.removeListener('change', listener);
};
PlotterStore.getChannel = function(panel) {
  if (!_plotters.has(panel)) addPlotter(panel);
  return _plotters.get(panel).channel;
};
PlotterStore.getKeys = function(panel) {
  if (!_plotters.has(panel)) addPlotter(panel);
  return _plotters.get(panel).keys;
};
PlotterStore.getData = function(panel) {
  if (!_plotters.has(panel)) addPlotter(panel);
  var plotter = _plotters.get(panel);
  updateData(plotter);
  return plotter.data;
};

DashDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_PORT_DATA:
      DashDispatcher.waitFor([MessageStore.dispatchToken]);
      PlotterStore.emitChange();
      break;
    case ActionTypes.SET_PLOTTER_CHANNEL:
      if (!_plotters.has(action.panel)) addPlotter(action.panel);
      var plotter = _plotters.get(action.panel);
      plotter.channel = action.channel;
      plotter.data.length = 0;
      plotter.keys.length = 0;
      PlotterStore.emitChange();
      break;
  }
});

module.exports = PlotterStore;
