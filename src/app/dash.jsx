var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require('react-tap-event-plugin');
var Dash = require('./components/dash');
var socket = require('./socket');

injectTapEventPlugin();


ReactDOM.render(<Dash />, document.getElementById('app'));

window.React = React;
window.dash = {socket};
