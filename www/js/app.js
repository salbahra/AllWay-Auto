// Ionic Starter App

// Angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// The 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module( "app", [ "ionic", "ion-autocomplete", "app.controllers", "app.routes", "app.services", "app.directives" ] )

.run( function( $ionicPlatform, $ionicLoading, $document, $rootScope, $timeout ) {
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

  // Automatically show a loading message on any AJAX request
  $rootScope.$on( "loading:show", function( e, data ) {

    // TODO: Handle more than one simultaneous AJAX
    $rootScope.canceller = data.canceller.resolve;
    $ionicLoading.show( {
      template: "<ion-spinner></ion-spinner><br>One moment please<br><button class='button icon-left ion-ios-close-outline button-clear' ng-click='$root.canceller()'>Cancel</button>"
    } );
  } );

  // Automatically hide the loading message after an AJAX request
  $rootScope.$on( "loading:hide", function() {
    $ionicLoading.hide();
  } );

  // Keep the page title locked as the app name
  $rootScope.$on( "$ionicView.afterEnter", function() {
    $document[ 0 ].title = "AllWay Auto";
  } );

  // Resize the main content view to fit when the window changes size
  angular.element( window ).on( "resize", function() {
    if ( window.innerWidth > 768 ) {
      angular.element( "#mainContent" ).width( window.innerWidth - 275 );
    }
  } );
} );
