var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-ruby-sass');

// Scripts Task - Minifies
gulp.task('scripts', function(){
    gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

// CSS Task - SASS
gulp.task('styles', function(){
    return sass('scss/styles.scss')
    .pipe(gulp.dest('css/'));
});

// Watch Task - JS and SASS
gulp.task('watch', function(){
    gulp.watch('js.app.js', ['scripts']);
    gulp.watch('scss/styles.scss', ['styles']);
});


gulp.task('default', ['scripts', 'styles', 'watch']);