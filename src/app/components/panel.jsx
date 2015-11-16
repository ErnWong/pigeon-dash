var React = require('react');
var update = require('react-addons-update');
var Paper = require('material-ui/lib/paper');

var Panel = React.createClass({
  propTypes: {
    style: React.PropTypes.object
  },
  render: function() {
    var style = this.props.style || {};
    var mergedStyles = update({
      width: '500px',
      height: '300px',
      margin: '50px',
      overflow: 'hidden'
    }, {$merge: style});
    return (
      <Paper style={mergedStyles}>
        {this.props.children}
      </Paper>
    );
  }
});

module.exports = Panel;
