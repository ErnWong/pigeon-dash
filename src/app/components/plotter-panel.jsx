var React = require('react');
var Panel = require('../components/panel');
var Toolbar = require('material-ui/lib/toolbar/toolbar');
var ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');
var IconButton = require('material-ui/lib/icon-button');
var FontIcon = require('material-ui/lib/font-icon');
var TextField = require('material-ui/lib/text-field');

var PlotterStore = require('../stores/plotter-store');
var DashActions = require('../actions/dash-actions');
var PlotterActions = require('../actions/plotter-actions');

var Dygraph = require('dygraphs');

function getState(component) {
  var panel = component.props.panel;
  return {
    recording: PlotterStore.isRecording(panel),
    keys: PlotterStore.getKeys(panel),
    data: PlotterStore.getData(panel)
  };
}

var PlotterPanel = React.createClass({
  getInitialState: function() {
    var state = getState(this);
    state.channelValue = '';
    return state;
  },
  componentWillMount: function() {
    this.interval = null;
  },
  componentDidMount: function() {
    PlotterStore.addChangeListener(this.storeChanged);
    this.setInterval();
    this.dygraph = new Dygraph(this.refs.graphDiv, [[0]], {
      labels: ['time'],
      rightGap: 0,
      showRangeSelector: true
    });
  },
  componentWillUnmount: function() {
    PlotterStore.removeChangeListener(this.storeChanged);
    this.clearInterval();
  },
  setInterval: function() {
    this.interval = setInterval(this.tick, 40);
  },
  clearInterval: function() {
    clearInterval(this.interval);
    this.interval = null;
  },
  storeChanged: function() {
    //this.setState(getState(this));
  },
  tick: function() {
    this.setState(getState(this));
    var data = this.state.data;
    var keys = ['time'].concat(this.state.keys)
    if (data.length === 0) {
      var zeroes = Array(keys.length).fill(0);
      // so Dygraph knows its intentionally empty
      data = [zeroes];
    }
    this.dygraph.updateOptions({
      file: data,
      labels: keys
    });
  },
  render: function() {
    return (
      <Panel
        style={{
          display: 'flex',
          flexFlow: 'column'
        }}>
        <Toolbar>
          <ToolbarGroup key={0} float='left'>
            <TextField
              hintText='Channel'
              value={this.state.channelValue}
              onChange={(e) => this.setState({channelValue: e.target.value})}
              onEnterKeyDown={this.handleSetChannel} />
          </ToolbarGroup>
          <ToolbarGroup key={1} float='right'>
            <FontIcon
              onClick={this.handleRecordToggle}
              className='material-icons'>{this.state.recording? 'pause' : 'fiber_manual_record'}</FontIcon>
            <FontIcon
              onClick={this.handleClear}
              className='material-icons'>delete</FontIcon>
            <FontIcon
              onClick={this.handleClose}
              className='material-icons'>close</FontIcon>
          </ToolbarGroup>
        </Toolbar>
        <div
          ref='graphDiv'
          style={{
            flexGrow: '1'
          }}>
        </div>
      </Panel>
    );
  },
  handleClose: function() {
    DashActions.closePanel(this.props.panel);
  },
  handleSetChannel: function() {
    PlotterActions.setChannel(this.props.panel, this.state.channelValue);
  },
  handleRecordToggle: function() {
    if (this.state.recording) {
      PlotterActions.pauseRecording(this.props.panel);
    }
    else {
      PlotterActions.startRecording(this.props.panel);
    }
  },
  handleClear: function() {
    PlotterActions.clear(this.props.panel);
  }
});

module.exports = PlotterPanel;
