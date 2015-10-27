var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', ['js', 'sass']);

gulp.task('js', function(){
  gulp.src('./src/*.js')
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