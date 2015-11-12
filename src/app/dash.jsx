var React = require('react');
var ReactDOM = require('react-dom');
var Dash = require('./components/dash');
var injectTapEventPlugin = require('react-tap-event-plugin');

injectTapEventPlugin();

var io = require('socket.io-client');
var socket = io();

ReactDOM.render(<Dash />, document.getElementById('app'));

window.React = React;
window.dash = {socket};
