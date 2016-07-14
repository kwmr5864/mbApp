var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
//var frontnote = require('gulp-frontnote');

var typescript = require('gulp-typescript');
var uglify = require('gulp-uglify');

var jade = require('gulp-jade');

gulp.task('sass', function () {
    gulp.src('resources/scss/style.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest("./www/css"));
});

gulp.task('ts', function () {
    gulp.src('resources/typescript/app.ts')
        .pipe(typescript({
            out: 'app.js',
            target: 'es5',
            removeComments: true,
            sortOutput: true
        }))
        //.pipe(uglify())
        .pipe(gulp.dest('./www/js'))
});

gulp.task('jade', function () {
    gulp.src('resources/jade/index.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./www'))
});