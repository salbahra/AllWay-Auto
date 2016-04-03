angular.module('app.controllers', [])

.controller('homeCtrl', function($scope) {

})

.controller('stockInVehicleCtrl', function($scope, CarAPI) {
	$scope.data = {};

	CarAPI.getAllModels( function( data ) {
		$scope.data.makes = data.makes;
	} );

	$scope.scanVIN = function() {
		cordova.plugins.barcodeScanner.scan(
			function(result) {
				$scope.data.vin = result.text;
			},
			function() {}
		);
	};
})

.controller('vinCtrl', function($scope) {

})

