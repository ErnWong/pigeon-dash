var gulp = require('gulp');
var nodemon = require('nodemon');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var chalk = require('chalk');

var bundler = browserify({
  entries: ['./src/app/dash.jsx'],
  extensions: ['.jsx'],
  transform: [babelify],
  debug: true,
  cache: {},
  packageCache: {}
});

function logger() {
  var args = Array.prototype.slice.call(arguments);
  return gutil.log.bind.apply(gutil.log, [gutil].concat(args));
}

function bundle() {
  return bundler.bundle()
    .on('error', logger(chalk.cyan('[browserify]')))
    .pipe(source('dash.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error',logger())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public'));
}

gulp.task('js', bundle);

gulp.task('static', function() {
  return gulp.src('./src/www/**/*')
    .pipe(gulp.dest('./public'));
});

gulp.task('build', ['js', 'static']);

gulp.task('watch-static', function() {
  return gulp.src('./src/www/**/*')
    .pipe(watch('./src/www/**/*'))
    .pipe(gulp.dest('./public'));
});

gulp.task('watch-js', function() {
  bundler.plugin(watchify)
    .on('update', bundle)
    .on('log', logger(chalk.magenta('[watchify]')));
  return bundle();
});

gulp.task('watch', ['watch-static', 'watch-js']);

gulp.task('serve', function() {
  nodemon({
    script: './src/server/server.js',
    ext: 'js json',
    watch: './src/server',
    verbose: true
  })
    .on('log', function(event) {
      gutil.log(event.colour);
    });
});

gulp.task('default', ['serve', 'watch']);
