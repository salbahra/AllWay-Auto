  angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('home2.home', {
    url: '/page1',
    views: {
      'side-menu21': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('home2.stockInVehicle', {
    url: '/stockInVehicle',
    views: {
      'side-menu21': {
        templateUrl: 'templates/stockInVehicle.html',
        controller: 'stockInVehicleCtrl'
      }
    }
  })

  .state('home2.cloud', {
    url: '/page3',
    views: {
      'side-menu21': {
        templateUrl: 'templates/cloud.html',
        controller: 'cloudCtrl'
      }
    }
  })

  .state('home2', {
    url: '/side-menu21',
    templateUrl: 'templates/home2.html',
    abstract:true
  })

$urlRouterProvider.otherwise('/side-menu21/page1')

  

});