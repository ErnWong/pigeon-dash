var gutil = require('gulp-util');
var chalk = require('chalk');

var signature = chalk.blue('[server]');

function info(msg) {
  gutil.log(signature, msg);
}

function error(msg) {
  gutil.log(signature, chalk.red(msg));
}

module.exports = {
  info: info,
  error: error
};
