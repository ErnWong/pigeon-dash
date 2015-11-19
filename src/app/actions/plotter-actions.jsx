var DashDispatcher = require('../dispatcher/dash-dispatcher');
var ActionTypes = require('../constants/action-types');
var PortActions = require('../actions/port-actions');

module.exports = {
  setChannel: function(panel, channel) {
    DashDispatcher.dispatch({
      type: ActionTypes.SET_PLOTTER_CHANNEL,
      panel: panel,
      channel: channel
    });
    PortActions.write(`\n${channel}.keys\n`);
  }
};
