/* global require, console, process */

// AllWay Cars

// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var	gulp	     = require( "gulp" ),               // Gulp
	gutil        = require( "gulp-util" ),          // Gulp Utilities
	autoprefixer = require( "gulp-autoprefixer" ),  // CSS Vendor Prefixing
	jshint       = require( "gulp-jshint" ),        // JSHint syntax check
	jscs         = require( "gulp-jscs" ),          // Javascript style checker
	runSequence  = require( "run-sequence" );       // Runs tasks in sequence

gulp.task( "default", function( callback ) {
	runSequence( "lint", callback );
} );

// Lint task
gulp.task( "lint", [ "lint-syntax", "lint-style" ] );

gulp.task( "lint-syntax", function() {
  return gulp.src( [ ".www/js/*.js" ] )
    .pipe( jshint() )
	.pipe( jshint.reporter( "default" ) )
	.pipe( jshint.reporter( "fail" ) );
} );

gulp.task( "lint-style", function() {
	return gulp.src( [ "./www/js/*.js" ] )
		.pipe( jscs() )
		.pipe( jscs.reporter() )
		.pipe( jscs.reporter( "fail" ) );
} );
