angular.module( "app.controllers", [] )

.controller( "homeCtrl", function( $scope ) {

} )

.controller( "stockInVehicleCtrl", function( $scope, CarAPI ) {
	$scope.data = {};
	$scope.info = {};

	CarAPI.getAllModels( function( data ) {
		$scope.info.makes = data.makes;
	} );

	$scope.scanVIN = function() {
		cordova.plugins.barcodeScanner.scan(
			function( result ) {
				console.log( result );
				CarAPI.getVINInfo( result.text, function( data ) {
					console.log( data );
				} );
			}
		);
	};

	$scope.getColors = function() {
		CarAPI.getColorForModel( $scope.data.make.name, $scope.data.model.name, $scope.data.year.year, function( data ) {
			$scope.info.colors = data;
		} );
	};

	$scope.saveCar = function() {
		console.log( $scope.addCar );
		if ( $scope.addCar.$valid ) {
			console.log( $scope.data );
		}
	};
} )

.controller( "vinCtrl", function( $scope ) {

} );

