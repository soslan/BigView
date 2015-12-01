var gulp = require('gulp');
var sass = require('gulp-sass');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

gulp.task('default', ['js', 'sass']);

gulp.task('js', function(){
  gulp.src('./src/*.js')
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename(function(path){
      path.basename += ".min"
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass', function(){
  gulp.src('./src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./src/*.scss', ['sass']);
});

gulp.task('jscs', function(){
  gulp.src('./src/*.js')
    .pipe(jscs())
    .pipe(jscs.reporter('text'));
});