var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', function() {
	
});

gulp.task('js', function(){
  gulp.src('./src/*.js')
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass', function(){
  gulp.src('./src/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./src/*.scss', ['sass']);
});