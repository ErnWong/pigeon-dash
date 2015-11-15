var React = require('react');
var Colors = require('material-ui/lib/styles/colors');
var PortList = require('./port-list');
var DashBar = require('./dash-bar');

var DashStore = require('../stores/dash-store');
var PanelLogic = require('../utils/panel-logic');

function getState() {
  return {
    panels: DashStore.getPanels(),
    connected: DashStore.isConnected()
  };
}

var Dash = React.createClass({
  getInitialState: function() {
    return getState();
  },
  componentDidMount: function() {
    DashStore.addChangeListener(this.storeChanged);
  },
  componentWillUnmount: function() {
    DashStore.removeChangeListener(this.storeChanged);
  },
  storeChanged: function() {
    this.setState(getState());
  },
  render: function() {
    var screen;
    if (!this.state.connected) {
      screen = <PortList />
    } else {
      screen = this.state.panels.map(function(panel, key) {
        return PanelLogic.renders.get(panel.type)(panel, key);
      });
    }
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexFlow: 'column'
      }}>
        <DashBar style={{
          flexGrow: '0',
          flexShrink: '0'
        }} />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: Colors.grey100,
          flexShrink: '1',
          flexGrow: '1',
        }}>
          {screen}
        </div>
      </div>
    );
  }
});

module.exports = Dash;
