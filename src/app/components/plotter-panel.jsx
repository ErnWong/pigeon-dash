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
  componentsWillMount: function() {
    //this.intervals = [];
  },
  componentDidMount: function() {
    PlotterStore.addChangeListener(this.storeChanged);
    this.intervals = [];
    this.intervals.push(setInterval(this.tick, 40));
    this.dygraph = new Dygraph(this.refs.graphDiv, [[0]], {
      labels: ['time']
    });
    //DEBUG:
    (window.dash ? window.dash : window.dash = {}).data = this.state.data;
  },
  componentWillUnmount: function() {
    PlotterStore.removeChangeListener(this.storeChanged);
    this.intervals.forEach(clearInterval);
  },
  storeChanged: function() {
    //this.setState(getState(this));
  },
  tick: function() {
    this.setState(getState(this));
    var data = this.state.data;
    if (data.length === 0) {
      data = [[0]];
    }
    this.dygraph.updateOptions({
      file: data,
      labels: ['time'].concat(this.state.keys)
    });
  },
  render: function() {
    return (
      <Panel>
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
              onClick={this.handleClose}
              className='material-icons'>close</FontIcon>
          </ToolbarGroup>
        </Toolbar>
        <div ref='graphDiv'>
        </div>
        {/*
        <svg>
          {
            this.state.keys.map((key, index) => {
              return (
                <path d={
                  this.state.data.reduceRight((out, data, i, array) => {
                    if (!array[i + 1]) {
                      return `M 0 ${data.values[index]}`;
                    }
                    var prev = array[i + 1];
                    var timestampChange = data.timestamp - prev.timestamp;
                    var valueChange = data.values[index] - prev.values[index];
                    return out + ` l ${timestampChange} ${valueChange}`;
                  }, '')
                } />
              );
            })
          }
        </svg>
        */}
      </Panel>
    );
  },
  handleClose: function() {
    DashActions.closePanel(this.props.panel);
  },
  handleSetChannel: function() {
    PlotterActions.setChannel(this.props.panel, this.state.channelValue);
  }
});

module.exports = PlotterPanel;
