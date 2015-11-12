var React = require('react');
var Card = require('material-ui/lib/card/card');
var List = require('material-ui/lib/lists/list');
var ListItem = require('material-ui/lib/lists/list-item');
var FontIcon = require('material-ui/lib/font-icon');

var PortList = React.createClass({
  propTypes: {
    ports: React.PropTypes.arrayOf(React.PropTypes.object)
  },
  render: function() {
    var ports = this.props.ports || [];
    return (
      <Card style={{
        display: 'inline-block',
        minWidth: '16em'
      }}>
        <List>
          {
            ports.map(({comName, manufacturer}) => (
              <ListItem
                key={comName}
                primaryText={`Open ${comName}`}
                secondaryText={manufacturer}
                rightIcon={<FontIcon className='material-icons'>input</FontIcon>}
                onClick={this.handleClick.bind(this, comName)} />
            ))
          }
        </List>
      </Card>
    );
  },
  handleClick: function(comName) {
    console.log(`Logging props.children: ${this.props.children}`);
  }
});

module.exports = PortList;
