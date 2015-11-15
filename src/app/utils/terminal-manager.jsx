var Terminal = require('../components/terminal');

module.exports = {
  init: function(terminal) {
  },
  render: function(panel, key) {
    return <Terminal panel={panel} key={key} />
  }
};
