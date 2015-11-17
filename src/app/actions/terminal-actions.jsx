var DashDispatcher = require('../dispatcher/dash-dispatcher');
var ActionTypes = require('../constants/action-types');

module.exports = {
  togglePlayPause: function(panel) {
    DashDispatcher.dispatch({
      type: ActionTypes.TOGGLE_TERMINAL_PLAYPAUSE,
      panel: panel
    });
  }
};
