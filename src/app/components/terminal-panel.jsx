var React = require('react');
var Panel = require('../components/panel');
var Toolbar = require('material-ui/lib/toolbar/toolbar');
var ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');
var IconButton = require('material-ui/lib/icon-button');
var FontIcon = require('material-ui/lib/font-icon');

var TerminalStore = require('../stores/terminal-store');
var DashActions = require('../actions/dash-actions');
var TerminalActions = require('../actions/terminal-actions');

function getState(component) {
  var panel = component.props.panel;
  return {
    messages: TerminalStore.getMessages(panel),
    filters: TerminalStore.getFilters(panel),
    paused: TerminalStore.isPaused(panel)
  };
}

var TerminalPanel = React.createClass({
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
      <Panel
        style={{
          display: 'flex',
          flexFlow: 'column'
        }}>
        <Toolbar>
          <ToolbarGroup key={0} float='right'>
            <FontIcon
              onClick={this.handlePausePlay}
              className='material-icons'>{this.state.paused? 'play_arrow' : 'pause'}</FontIcon>
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
            overflow: 'auto',
            flexGrow: '1',
            backgroundColor: '#272822',
            color: '#FFFFFF',
            padding: '1em'
          }}>
          <pre>
            {messageDisplay}
          </pre>
        </div>
      </Panel>
    );
  },
  handlePausePlay: function() {
    TerminalActions.togglePlayPause(this.props.panel);
  },
  handleOpenFilter: function() {
  },
  handleClose: function() {
    DashActions.closePanel(this.props.panel);
  }
});

module.exports = TerminalPanel;
