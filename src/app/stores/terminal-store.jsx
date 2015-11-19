var EventEmitter = require('events').EventEmitter;
var DashDispatcher = require('../dispatcher/dash-dispatcher');
var ActionTypes = require('../constants/action-types');
var MessageStore = require('../stores/message-store');
var MessageUpdate = require('../utils/message-update');
var clipBuffer = require('../utils/message-clip');

var _terminals = new WeakMap();

function addTerminal(panel) {
  _terminals.set(panel, {
    messages: [],
    filters: [],
    paused: false
  });
}

var MAX_BUFFER_SIZE = 128;

function updateMessages(terminal) {
  var buffer = MessageStore.getMessages();
  MessageUpdate(terminal.messages, buffer, function(message) {
    return true;
  });
  /*
  var lastMessage = terminal.messages[terminal.messages.length - 1];
  var i = _messages.length - 1;
  while (i >= 0) {
    if (_messages[i] === lastMessage) break;
    i--;
  }
  var newMessages = _messages
    .slice(i + 1)
    .filter(function(message) {
      return true;
    });
  terminal.messages.push.apply(terminal.messages, newMessages);
  */
  clipBuffer(terminal.messages, MAX_BUFFER_SIZE);
}

var TerminalStore = new EventEmitter();

TerminalStore.emitChange = function() {
  this.emit('change');
};
TerminalStore.addChangeListener = function(listener) {
  this.on('change', listener);
};
TerminalStore.removeChangeListener = function(listener) {
  this.removeListener('change', listener);
};
TerminalStore.getMessages = function(panel) {
  if (!_terminals.has(panel)) addTerminal(panel);
  var terminal = _terminals.get(panel);

  if (!terminal.paused) updateMessages(terminal);
  return terminal.messages;
};
TerminalStore.getFilters = function(panel) {
  if (!_terminals.has(panel)) addTerminal(panel);
  return _terminals.get(panel).filters;
};
TerminalStore.isPaused = function(panel) {
  if (!_terminals.has(panel)) addTerminal(panel);
  return _terminals.get(panel).paused;
};

DashDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_PORT_DATA:
      DashDispatcher.waitFor([MessageStore.dispatchToken]);
      TerminalStore.emitChange();
      break;
    case ActionTypes.TOGGLE_TERMINAL_PLAYPAUSE:
      if (_terminals.has(action.panel)) {
        var terminal = _terminals.get(action.panel);
        terminal.paused = !terminal.paused;
        TerminalStore.emitChange();
      }
      break;
  }
});

module.exports = TerminalStore;
