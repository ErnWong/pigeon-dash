var DashDispatcher = require('../dispatcher/dash-dispatcher');

module.exports = {
  selectPort: function(comName) {
    DashDispatcher.dispatch({
      type: 'select-port',
      selection: comName
    });
  }
};
