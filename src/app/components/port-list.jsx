var React = require('react');
var Card = require('material-ui/lib/card/card');
var CardText = require('material-ui/lib/card/card-text');
var List = require('material-ui/lib/lists/list');
var ListItem = require('material-ui/lib/lists/list-item');
var LinearProgress = require('material-ui/lib/linear-progress');
var FontIcon = require('material-ui/lib/font-icon');

var PortStore = require('../stores/port-store');
var PortActions = require('../actions/port-actions');

function getState() {
    return {
      loading: PortStore.isLoading(),
      opening: PortStore.isOpening(),
      ports: PortStore.getPorts(),
      selected: PortStore.getSelected()
    };
}

var PortList = React.createClass({
  getInitialState: function() {
    return getState();
  },
  componentDidMount: function() {
    PortStore.on('changed', this.listChanged);
  },
  componentWillUnmount: function() {
    PortStore.removeListener('changed', this.listChanged);
  },
  listChanged: function() {
    this.setState(getState());
  },
  render: function() {
    var list;
    if (this.state.ports.length > 0) {
      list = (
        <List>
          {
            this.state.ports.map(({comName, manufacturer}) => (
              <ListItem
                key={comName}
                primaryText={`Open ${comName}`}
                secondaryText={manufacturer}
                rightIcon={<FontIcon className='material-icons'>input</FontIcon>}
                style={{
                  opacity: this.state.selected && this.state.selected != comName? 0.5 : 1
                }}
                onClick={this.state.selected?()=>{}:this.handleClick.bind(this, comName)} />
            ))
          }
        </List>
      );
    } else if (this.state.loading) {
      list = <CardText>Loading...</CardText>
    } else {
      list = <CardText>No ports available.</CardText>
    }
    return (
      <Card style={{
        display: 'inline-block',
        position: 'relative',
        minWidth: '16em'
      }}>
        <LinearProgress
          mode='indeterminate'
          style={{
            position: 'absolute',
            display: (this.state.loading || this.state.opening)? 'block' : 'none'
          }} />
        {list}
      </Card>
    );
  },
  handleClick: function(comName) {
    PortActions.selectPort(comName);
  }
});

module.exports = PortList;
