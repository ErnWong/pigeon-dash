var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require('react-tap-event-plugin');
var Dash = require('./components/dash');
var Server = require('./utils/server');

injectTapEventPlugin();

Server.requestPorts();
Server.startListening();

ReactDOM.render(<Dash />, document.getElementById('app'));

window.React = React;
