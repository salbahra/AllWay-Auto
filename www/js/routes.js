  angular.module( "app.routes", [] )

.config( function( $stateProvider, $urlRouterProvider, $compileProvider, $ionicConfigProvider, $httpProvider ) {

  // Modify Ionic's allowed href protocols to allow Firefox, Blackberry, iOS and Chrome support
  $compileProvider.aHrefSanitizationWhitelist( /^\s*(https?|ftp|mailto|chrome-extension|app|local|file):/ );

  // Modify Ionic's allowed image source protocols
  $compileProvider.imgSrcSanitizationWhitelist( /^\s*(https?|ftp|file|content|blob|ms-appx|x-wmapp0|chrome-extension|app|local):|data:image\// );

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

    .state( "app.help", {
      url: "/help",
      views: {
        menu: {
          templateUrl: "templates/help.html",
          controller: "helpCtrl"
        }
      }
    } )

    .state( "app", {
      url: "/app",
      templateUrl: "templates/menu.html",
      controller: "menuCtrl",
      abstract: true
    } );

  $urlRouterProvider.otherwise( "/app/home" );

  // Add an HTTP interceptor
  $httpProvider.interceptors.push( function( $rootScope, $q, $injector ) {
    return {
      request: function( config ) {

        // When an AJAX request to the API is started, fire an event to show a loading message
        if ( config.url.indexOf( "104.131.184.55" ) !== -1 ) {

          // Change timeout to a promise we can cancel
          var canceller = $q.defer();

          // Set the timeout to the canceller promise
          config.timeout = canceller.promise;

          // Set the current retry count to 0
          if ( typeof config.retryCount !== "number" ) {
            config.retryCount = 0;
          }

          $rootScope.$broadcast( "loading:show", { canceller: canceller } );
        } else {

          // Set the global HTTP timeout
          config.timeout = 10000;
        }
        return config;
      },
      response: function( response ) {

        // If the request is to the API, broadcast a hide loading message
        if ( response.config.url.indexOf( "104.131.184.55" ) !== -1 ) {
          $rootScope.$broadcast( "loading:hide" );
        }

        return response;
      },
      responseError: function( error ) {

        var isAPI = error.config.url.indexOf( "104.131.184.55" ) !== -1 ? true : false;

        // If the timeout value is an object and is resolved, mark request as user canceled
        if ( error.config.timeout.$$state && error.config.timeout.$$state.status === 1 ) {
          error.canceled = true;
        }

        // If the request is to the API, broadcast a hide loading message
        if ( isAPI ) {
          $rootScope.$broadcast( "loading:hide" );
        }

        // If the request timed out and is not user canceled, retry the request up to three times
        if ( error.status === 0 && !error.canceled ) {
          if ( error.config.retryCount < 3 ) {
            var $http = $injector.get( "$http" );

            error.config.retryCount++;

            // Return the new promise object
            return $http( error.config );
          } else {

            // After three timeouts, assume the network is down
            error.retryFailed = true;
            error.canceled = true;
            return $q.reject( error );
          }
        }

        return $q.reject( error );
      }
    };
  } );

  // Inform Ionic we want to cache forward views
  $ionicConfigProvider.views.forwardCache( true );

} );
