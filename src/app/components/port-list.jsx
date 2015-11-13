var React = require('react');
var Card = require('material-ui/lib/card/card');
var CardText = require('material-ui/lib/card/card-text');
var List = require('material-ui/lib/lists/list');
var ListItem = require('material-ui/lib/lists/list-item');
var RefreshIndicator = require('material-ui/lib/refresh-indicator');
var FontIcon = require('material-ui/lib/font-icon');

var PortStore = require('../stores/port-store');

function getState() {
    return {
      loading: PortStore.isLoading(),
      ports: PortStore.getPorts()
    };
}

var PortList = React.createClass({
  getInitialState: function() {
    return getState();
  },
  componentDidMount: function() {
    PortStore.on('change', this.listChanged);
  },
  componentWillUnmount: function() {
    PortStore.removeListener('change', this.listChanged);
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
                onClick={this.handleClick.bind(this, comName)} />
            ))
          }
        </List>
      );
    } else if (this.state.loading) {
      list = <RefreshIndicator top={0} left={0} status='loading' />
    } else {
      list = <CardText>No ports available.</CardText>
    }
    return (
      <Card style={{
        display: 'inline-block',
        minWidth: '16em'
      }}>
        {list}
      </Card>
    );
  },
  handleClick: function(comName) {
    console.log(`Logging props.children: ${this.props.children}`);
  }
});

module.exports = PortList;
