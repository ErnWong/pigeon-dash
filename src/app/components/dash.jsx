var React = require('react');
var Colors = require('material-ui/lib/styles/colors');
var PortList = require('./port-list');

var Dash = React.createClass({
  render: function() {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.grey100
      }}>
        <PortList ports={[
          {
            comName: 'COM3',
            manufacturer: 'Microchip Technology, Inc.'
          },
          {
            comName: 'COM7',
            manufacturer: 'Vex Robotics'
          }
        ]} />
      </div>
    );
  }
});

module.exports = Dash;
