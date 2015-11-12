var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('js', function() {
  return bundler browserify({
    debug: true,
    extensions: ['jsx']
  })
    .add('./src/app/dash.jsx')
    .transform(babelify)
    .bundle()
    .pipe(source('dash.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public'))
});

gulp.task('static', function() {
  return gulp.src('./src/www')
    .pipe(gulp.dest('./public'));
});

gulp.task('build', ['js', 'static']);

gulp.task('watch', ['build'], function() {
  gulp.watch('*.jsx', ['build']);
});

gulp.task('default', ['watch']);
