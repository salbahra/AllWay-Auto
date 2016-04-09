/* global require, console, process */

// AllWay Auto

// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var	gulp	     = require( "gulp" ),               // Gulp
	gutil        = require( "gulp-util" ),          // Gulp Utilities
	autoprefixer = require( "gulp-autoprefixer" ),  // CSS Vendor Prefixing
	jshint       = require( "gulp-jshint" ),        // JSHint syntax check
	jscs         = require( "gulp-jscs" ),          // Javascript style checker
	notify       = require( "gulp-notify" ),        // Advanced Notifications
	rename       = require( "gulp-rename" ),        // Rename Files & Directories
	minifyCss    = require( "gulp-minify-css" ),    // CSS Minification
	sass         = require( "gulp-sass" ),          // SASS Compilation
	runSequence  = require( "run-sequence" );       // Runs tasks in sequence

gulp.task( "default", function( callback ) {
	runSequence( "lint", "sass", callback );
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

// Compiles SASS & attaches vendor prefixes
gulp.task( "sass", function() {
	return gulp.src( "scss/ionic.app.scss" )

	    // Use gulp-notify as SASS reporter
		.pipe( sass.sync( {
			style: "compressed",
			errLogToConsole: false,
			onError: function( err ) {
			    return notify().write( err );
			}
		} ) )
		.pipe( autoprefixer( {
			browsers: [ "last 2 versions", "ie 9", "ie 10" ]
		} ) )
		.pipe( minifyCss( {
			keepBreaks:true
		} ) )
		.pipe( rename( { extname: ".min.css" } ) )
        .pipe( gulp.dest( "./www/css/", { mode: "0755" } ) )
        .pipe( notify( { message: "CSS processing complete..." } ) );
} );

// SASS Listener
gulp.task( "watch", function() {
	gulp.watch( [ "scss/ionic.app.scss" ], [ "sass" ] );
} );
