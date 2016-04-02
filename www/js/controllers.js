angular.module('app.controllers', [])

.controller('homeCtrl', function($scope) {

})

.controller('stockInVehicleCtrl', function($scope, CarAPI) {
	$scope.data = {};

	CarAPI.getAllModels( function( data ) {
		$scope.data.makes = data.makes;
	} );
})

.controller('vinCtrl', function($scope) {

})

