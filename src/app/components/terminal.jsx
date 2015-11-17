var React = require('react');
var Panel = require('../components/panel');
var Toolbar = require('material-ui/lib/toolbar/toolbar');
var ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');
var IconButton = require('material-ui/lib/icon-button');
var FontIcon = require('material-ui/lib/font-icon');

var TerminalStore = require('../stores/terminal-store');
var DashActions = require('../actions/dash-actions');

function getState(component) {
  var panel = component.props.panel;
  return {
    messages: TerminalStore.getMessages(panel),
    filters: TerminalStore.getFilters(panel)
  };
}

var Terminal = React.createClass({
  getInitialState: function() {
    return getState(this);
  },
  componentDidMount: function() {
    TerminalStore.addChangeListener(this.storeChanged);
  },
  componentWillUnmount: function() {
    TerminalStore.removeChangeListener(this.storeChanged);
  },
  storeChanged: function() {
    this.setState(getState(this));
  },
  render: function() {
    var messageDisplay = this.state.messages.map(function(message) {
      return message.raw;
    }).join('\n');
    return (
      <Panel>
        <Toolbar>
          <ToolbarGroup key={0} float='right'>
            <FontIcon
              onClick={this.handleOpenFilter}
              className='material-icons'>filter_list</FontIcon>
            <FontIcon
              onClick={this.handleClose}
              className='material-icons'>close</FontIcon>
          </ToolbarGroup>
        </Toolbar>
        <div
          style={{
            overflowX: 'hidden',
            overflowY: 'scroll'
          }}>
          <pre>
            {messageDisplay}
          </pre>
        </div>
      </Panel>
    );
  },
  handleOpenFilter: function() {
  },
  handleClose: function() {
    DashActions.closePanel(this.props.panel);
  }
});

module.exports = Terminal;
