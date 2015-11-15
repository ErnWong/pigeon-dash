var React = require('react');
var TerminalStore = require('../stores/terminal-store');
var Panel = require('../components/panel');

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
        <pre>
          {messageDisplay}
        </pre>
      </Panel>
    );
  }
});

module.exports = Terminal;
