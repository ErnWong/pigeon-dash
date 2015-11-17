var React = require('react');
var Panel = require('../components/panel');
var Toolbar = require('material-ui/lib/toolbar/toolbar');
var ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');
var IconButton = require('material-ui/lib/icon-button');
var FontIcon = require('material-ui/lib/font-icon');

//var PlotterStore = require('../stores/terminal-store');
var DashActions = require('../actions/dash-actions');

function getState(component) {
  var panel = component.props.panel;
  return {
  };
}

var PlotterPanel = React.createClass({
  getInitialState: function() {
    return getState(this);
  },
  componentDidMount: function() {
    //PlotterStore.addChangeListener(this.storeChanged);
  },
  componentWillUnmount: function() {
    //PlotterStore.removeChangeListener(this.storeChanged);
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

module.exports = PlotterPanel;
