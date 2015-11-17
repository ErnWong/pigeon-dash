var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var IconButton = require('material-ui/lib/icon-button');
var FontIcon = require('material-ui/lib/font-icon');

var TerminalPanel = require('../components/terminal-panel');
var SettingsPanel = require('../components/settings-panel');
var PlotterPanel = require('../components/plotter-panel');
var DashStore = require('../stores/dash-store');
var DashActions = require('../actions/dash-actions');

function getState() {
  return {
    connected: DashStore.isConnected()
  };
}

var DashBar = React.createClass({
  propTypes: {
    style: React.PropTypes.object
  },
  getInitialState: function() {
    return getState();
  },
  componentDidMount: function() {
    DashStore.addChangeListener(this.listChanged);
  },
  componentWillMount: function() {
    DashStore.removeChangeListener(this.listChanged);
  },
  listChanged: function() {
    this.setState(getState());
  },
  render: function() {
    var conditionalProps = {};
    if (this.state.connected) {
      conditionalProps.iconElementRight = (
        <IconMenu iconButtonElement={
          <IconButton><FontIcon className='material-icons'>add</FontIcon></IconButton>
        }>
          <MenuItem primaryText='Add terminal' leftIcon={
            <FontIcon className='material-icons'>code</FontIcon>
          } onClick = {this.handleMenuClick.bind(this, TerminalPanel)} />
          <MenuItem primaryText='Add setting' leftIcon={
            <FontIcon className='material-icons'>tune</FontIcon>
          } onClick = {this.handleMenuClick.bind(this, SettingsPanel)} />
          <MenuItem primaryText='Add Plot' leftIcon={
            <FontIcon className='material-icons'>insert_chart</FontIcon>
          } onClick = {this.handleMenuClick.bind(this, PlotterPanel)} />
        </IconMenu>
      );
    }
    return (
        <AppBar
          style={this.props.style}
          title='Pigeon-Dash'
          {...conditionalProps} />
    );
  },
  handleMenuClick: function(panelClass) {
    DashActions.openPanel(panelClass);
  }
});

module.exports = DashBar;
