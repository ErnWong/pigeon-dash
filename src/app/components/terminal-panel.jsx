var React = require('react');
var Panel = require('../components/panel');
var Toolbar = require('material-ui/lib/toolbar/toolbar');
var ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');
var IconButton = require('material-ui/lib/icon-button');
var FontIcon = require('material-ui/lib/font-icon');

var TerminalStore = require('../stores/terminal-store');
var DashActions = require('../actions/dash-actions');
var TerminalActions = require('../actions/terminal-actions');
var PortActions = require('../actions/port-actions');

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
    var state = getState(this);
    state.inputText = '';
    return state;
  },
  componentDidMount: function() {
    this.refs.termBox.scrollTop = this.refs.termBox.scrollHeight;
    TerminalStore.addChangeListener(this.storeChanged);
  },
  componentWillUnmount: function() {
    TerminalStore.removeChangeListener(this.storeChanged);
  },
  componentWillUpdate: function() {
    var el = this.refs.termBox;
    this.shouldScrollBottom = el.scrollTop + el.offsetHeight >= el.scrollHeight;
  },
  componentDidUpdate: function() {
    if (this.shouldScrollBottom) {
      this.refs.termBox.scrollTop = this.refs.termBox.scrollHeight;
    }
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
            flexGrow: '1',
            backgroundColor: '#272822',
            color: '#FFFFFF',
            fontFamily: 'Consolas',
            fontSize: '10pt',
            display: 'flex',
            flexFlow: 'column'
          }}>
          <div
            ref='termBox'
            style={{
              overflow: 'auto',
              flexGrow: '1',
              padding: '1em 1em 0.5em 1em',
              height: '0'
            }}>
            <pre>
              {messageDisplay}
            </pre>
          </div>
          <div
            style={{
              display: 'flex',
              flexFlow: 'row',
              padding: '0.5em 1em 1em 1em'
            }}>
            <FontIcon
              className='material-icons'
              color='#CACACA'
              hoverColor='#FFFFFF' >keyboard_arrow_right</FontIcon>
            <input
              onChange={(e) => this.setState({inputText: e.target.value})}
              onKeyDown={(e) => {if (e.keyCode === 13) this.handleSend()}}
              value={this.state.inputText}
              style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              font: 'inherit',
              color: 'inherit',
              flexGrow: '1'
            }} />
          </div>
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
  },
  handleSend: function() {
    PortActions.write(this.state.inputText + '\n');
    this.setState({
      inputText: ''
    });
  }
});

module.exports = TerminalPanel;
