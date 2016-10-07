/*------
	GULP
------*/
var gulp = require('gulp');
/*-----------
	- PLUGINS
-----------*/
var minifyHTML = require('gulp-minify-html');
var uglify = 		 require('gulp-uglify');
var sass = 			 require('gulp-sass');
var inject =		 require('gulp-inject');
/*-----------
	- OPTIONS
-----------*/
var sassOptions = {
  outputStyle: 'compressed',
  errLogToConsole: true
};
// dependencies file paths
var injectSources = gulp.src([
	'./build/scripts/index.js',
	'./build/styles/style.css'
], { read: false } );

/*-------------------------------------
	TASKS
	- SCRIPTS uglify, pipe to build dir
-------------------------------------*/
gulp.task ('scripts', function() {
  return gulp.src ('./app/scripts/index.js')
    .pipe( uglify() )
    .pipe( gulp.dest('./build/scripts/') );
});
/*--------------------------------------------------
	- STYLES compile sass, minify, pipe to build dir
--------------------------------------------------*/
gulp.task('styles', function() {
  return gulp.src('./app/styles/style.scss')
    .pipe( sass(sassOptions).on('error', sass.logError) )
    .pipe( gulp.dest ('./build/styles/') );
});
/*--------------------------------------------------------------
	- MARKUP inject dependencies, minify html, pipe to build dir
--------------------------------------------------------------*/
gulp.task('html', function() {
  return gulp.src('./app/views/index.html')
	  .pipe( inject (injectSources) )
	  .pipe( minifyHTML() )
	  .pipe( gulp.dest ('./build/views/') );
});
/*--------------------------------------------------
	- BUILD populate build folder
--------------------------------------------------*/
gulp.task('build', ['scripts', 'styles', 'html']);
/*---------
	- WATCH
---------*/
gulp.task('watch', function() {
	gulp.watch('app/styles/style.scss', ['build']);
});