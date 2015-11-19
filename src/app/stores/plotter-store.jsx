var EventEmitter = require('events').EventEmitter;
var DashDispatcher = require('../dispatcher/dash-dispatcher');
var ActionTypes = require('../constants/action-types');
var MessageStore = require('../stores/message-store');

var _plotters = new WeakMap();
var _lastTimestamp = 0;

function addPlotter(panel) {
  _plotters.set(panel, {
    channel: '',
    recording: false,
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
    var shouldRecord = plotter.recording && plotter.keys.length > 0;
    if (shouldRecord > 0 && message.channel == plotter.channel) {
      var values = message.message
        .split(' ')
        .map((str) => +str);
      if (values.length < plotter.keys.length) {
        var start = values.length;
        values.length = plotter.keys.length;
        values.fill(0, start, plotter.keys.length);
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
PlotterStore.isRecording = function(panel) {
  if (!_plotters.has(panel)) addPlotter(panel);
  return _plotters.get(panel).recording;
};

DashDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_PORT_DATA:
      if (action.data.timestamp > _lastTimestamp) {
        _lastTimestamp = action.data.timestamp;
      }
      DashDispatcher.waitFor([MessageStore.dispatchToken]);
      PlotterStore.emitChange();
      break;
    case ActionTypes.SET_PLOTTER_CHANNEL:
      if (!_plotters.has(action.panel)) addPlotter(action.panel);
      var plotter = _plotters.get(action.panel);
      plotter.channel = action.channel;
      plotter.keys.length = 0;
      PlotterStore.emitChange();
      break;
    case ActionTypes.START_PLOTTER_RECORDING:
      if (!_plotters.has(action.panel)) addPlotter(action.panel);
      var plotter = _plotters.get(action.panel);
      plotter.recording = true;

      // continue from latest messages
      plotter.lastTimestamp = _lastTimestamp;
      PlotterStore.emitChange();
      break;
    case ActionTypes.PAUSE_PLOTTER_RECORDING:
      if (!_plotters.has(action.panel)) addPlotter(action.panel);
      var plotter = _plotters.get(action.panel);
      plotter.recording = false;
      PlotterStore.emitChange();
      break;
    case ActionTypes.CLEAR_PLOTTER:
      if (!_plotters.has(action.panel)) addPlotter(action.panel);
      var plotter = _plotters.get(action.panel);
      plotter.data.length = 0;
      PlotterStore.emitChange();
      break;
  }
});

module.exports = PlotterStore;
