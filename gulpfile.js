var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var bundler = browserify({
  entries: ['./src/app/dash.jsx'],
  extensions: ['.jsx'],
  transform: [babelify],
  debug: true,
  cache: {},
  packageCache: {}
});

function bundle() {
  return bundler.bundle()
    .on('error', gutil.log.bind(gutil, '[browserify]'))
    .pipe(source('dash.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public'));
}

gulp.task('js', bundle);

gulp.task('static', function() {
  return gulp.src('./src/www/**')
    .pipe(gulp.dest('./public'));
});

gulp.task('build', ['js', 'static']);

gulp.task('watch', function() {
  gulp.watch('./src/www/**', ['static']);
  bundler.plugin(watchify)
    .on('update', bundle)
    .on('log', gutil.log.bind(gutil, '[watchify]'));
  return bundle();
});

gulp.task('default', ['watch']);
