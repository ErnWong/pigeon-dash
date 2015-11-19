var DashDispatcher = require('../dispatcher/dash-dispatcher');
var ActionTypes = require('../constants/action-types');
var PortActions = require('../actions/port-actions');

module.exports = {
  startRecording: function(panel) {
    DashDispatcher.dispatch({
      type: ActionTypes.START_PLOTTER_RECORDING,
      panel: panel
    });
  },
  pauseRecording: function(panel) {
    DashDispatcher.dispatch({
      type: ActionTypes.PAUSE_PLOTTER_RECORDING,
      panel: panel
    });
  },
  clear: function(panel) {
    this.pauseRecording(panel);
    DashDispatcher.dispatch({
      type: ActionTypes.CLEAR_PLOTTER,
      panel: panel
    });
  },
  setChannel: function(panel, channel) {
    this.clear(panel);
    DashDispatcher.dispatch({
      type: ActionTypes.SET_PLOTTER_CHANNEL,
      panel: panel,
      channel: channel
    });
    PortActions.write(`\n${channel}.keys\n`);
  }
};
