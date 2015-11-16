var DashDispatcher = require('../dispatcher/dash-dispatcher');
var ActionTypes = require('../constants/action-types');

module.exports = {
  openPanel: function(panelType) {
    DashDispatcher.dispatch({
      type: ActionTypes.OPEN_PANEL,
      panelType: panelType
    });
  },
  closePanel: function(panel) {
    DashDispatcher.dispatch({
      type: ActionTypes.CLOSE_PANEL,
      panel: panel
    });
  }
};
