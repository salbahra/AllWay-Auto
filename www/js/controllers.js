angular.module( "app.controllers", [] )

.controller( "homeCtrl", function( $scope ) {

} )

.controller( "stockInVehicleCtrl", function( $scope, $filter, CarAPI ) {
	var filterFilter = $filter( "filter" );

	$scope.data = {};
	$scope.info = {};

	CarAPI.getAllModels( function( data ) {
		$scope.info.makes = data.makes;
	} );

	$scope.scanVIN = function() {
		cordova.plugins.barcodeScanner.scan(
			function( result ) {
				if ( result.text ) {
					$scope.data.vin = result.text;
					CarAPI.getVINInfo( result.text, function( data ) {
						$scope.data.make = [ data.make ];
						$scope.data.model = [ data.model ];
						$scope.data.color = [ data.colors.options[ 0 ] ];
					} );
				}
			}
		);
	};

	window.testShit = function() {
		result = {
			text: "4T1BK1EB6DU056165"
		};
		$scope.data.vin = result.text;
		CarAPI.getVINInfo( result.text, function( data ) {
			$scope.data.make = $scope.info.makes[ $scope.info.makes.indexOf( filterFilter( $scope.info.makes, { id: data.make.id } )[ 0 ] ) ];
			$scope.data.model = $scope.data.make.models[ $scope.data.make.models.indexOf( filterFilter( $scope.data.make.models, { id: data.model.id } )[ 0 ] ) ];
			$scope.data.year = $scope.data.model.years[ $scope.data.model.years.indexOf( filterFilter( $scope.data.model.years, { id: data.years.id } )[ 0 ] ) ];
			$scope.info.colors = data.colors[ 0 ].options;
		} );
	};

	$scope.getColors = function() {
		CarAPI.getColorForModel( $scope.data.make.name, $scope.data.model.name, $scope.data.year.year, function( data ) {
			$scope.info.colors = data.styles[ 0 ].colors[ 1 ].options;
		} );
	};

	$scope.saveCar = function() {
		console.log( $scope.data );
	};
} )

.controller( "vinCtrl", function( $scope ) {

} );

