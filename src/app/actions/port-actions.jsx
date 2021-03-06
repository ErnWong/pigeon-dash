var DashDispatcher = require('../dispatcher/dash-dispatcher');
var ActionTypes = require('../constants/action-types');
var ServerEvents = require('../constants/server-events');
var Server = require('../utils/server');

var PortActions = {
  selectPort: function(comName) {
    this.stopListening();
    Server.openPort(comName);
    DashDispatcher.dispatch({
      type: ActionTypes.SELECT_PORT,
      selection: comName
    });
  },
  receiveList: function(ports) {
    DashDispatcher.dispatch({
      type: ActionTypes.RECEIVE_PORT_LIST,
      ports: ports
    });
  },
  receiveOpened: function() {
    DashDispatcher.dispatch({
      type: ActionTypes.RECEIVE_PORT_OPEN
    });
  },
  receiveClosed: function() {
    DashDispatcher.dispatch({
      type: ActionTypes.RECEIVE_PORT_CLOSE
    });
  },
  receiveData: function(data) {
    DashDispatcher.dispatch({
      type: ActionTypes.RECEIVE_PORT_DATA,
      data: data
    });
  },
  startListening: function() {
    Server.startListening();
    DashDispatcher.dispatch({
      type: ActionTypes.START_PORT_LISTENING
    });
  },
  stopListening: function() {
    Server.stopListening();
    DashDispatcher.dispatch({
      type: ActionTypes.STOP_PORT_LISTENING
    });
  },
  write: function(message) {
    Server.writePort(message);
  }
};

Server.on(ServerEvents.PORT_LIST, function(ports) {
  PortActions.receiveList(ports);
});
Server.on(ServerEvents.PORT_OPENED, function() {
  PortActions.receiveOpened();
});
Server.on(ServerEvents.PORT_CLOSED, function() {
  PortActions.receiveClosed();
});
Server.on(ServerEvents.PORT_DATA, function(data) {
  PortActions.receiveData(data);
});

module.exports = PortActions;
