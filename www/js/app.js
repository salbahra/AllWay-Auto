// Ionic Starter App

// Angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// The 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module( "app", [ "ionic", "ion-autocomplete", "app.controllers", "app.routes", "app.services", "app.directives" ] )

.run( function( $ionicPlatform, $timeout ) {
  $ionicPlatform.ready( function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if ( window.cordova && window.cordova.plugins.Keyboard ) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar( true );
    }
    if ( window.StatusBar ) {

      // For org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // Hide the splash screen after 500ms of the app being ready
    $timeout( function() {
      try {
        navigator.splashscreen.hide();
      } catch ( err ) {}
    }, 500 );
  } );
} );
