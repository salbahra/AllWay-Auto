  angular.module( "app.routes", [] )

.config( function( $stateProvider, $urlRouterProvider ) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state( "app.home", {
      url: "/home",
      views: {
        menu: {
          templateUrl: "templates/home.html",
          controller: "homeCtrl"
        }
      }
    } )

    .state( "app.stockInVehicle", {
      url: "/stockInVehicle",
      views: {
        menu: {
          templateUrl: "templates/stockInVehicle.html",
          controller: "stockInVehicleCtrl"
        }
      }
    } )

    .state( "app.vin", {
      url: "/vin",
      views: {
        menu: {
          templateUrl: "templates/vin.html",
          controller: "vinCtrl"
        }
      }
    } )

    .state( "app", {
      url: "/app",
      templateUrl: "templates/menu.html",
      abstract: true
    } );

  $urlRouterProvider.otherwise( "/app/home" );

} );
