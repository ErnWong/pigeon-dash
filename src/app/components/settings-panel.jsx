var React = require('react');
var Panel = require('../components/panel');
var Toolbar = require('material-ui/lib/toolbar/toolbar');
var ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');
var IconButton = require('material-ui/lib/icon-button');
var FontIcon = require('material-ui/lib/font-icon');

//var SettingsStore = require('../stores/terminal-store');
var DashActions = require('../actions/dash-actions');

function getState(component) {
  var panel = component.props.panel;
  return {
  };
}

var SettingsPanel = React.createClass({
  getInitialState: function() {
    return getState(this);
  },
  componentDidMount: function() {
    //SettingsStore.addChangeListener(this.storeChanged);
  },
  componentWillUnmount: function() {
    //SettingsStore.removeChangeListener(this.storeChanged);
  },
  storeChanged: function() {
    //this.setState(getState(this));
  },
  render: function() {
    return (
      <Panel>
        <Toolbar>
          <ToolbarGroup key={0} float='right'>
            <FontIcon
              onClick={this.handleClose}
              className='material-icons'>close</FontIcon>
          </ToolbarGroup>
        </Toolbar>
      </Panel>
    );
  },
  handleClose: function() {
    DashActions.closePanel(this.props.panel);
  }
});

module.exports = SettingsPanel;
