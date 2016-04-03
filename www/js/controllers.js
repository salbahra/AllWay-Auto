angular.module( "app.controllers", [] )

.controller( "homeCtrl", function( $scope ) {
	$scope.cars = [];
} )

.controller( "stockInVehicleCtrl", function( $scope, $filter, $ionicPopup, CarAPI ) {
	var filterFilter = $filter( "filter" );

	$scope.data = {
		make: [],
		model: [],
		year: [],
		color: []
	};
	$scope.info = {
		makes: [],
		colors: [],
		years: []
	};

	CarAPI.getAllModels( function( data ) {
		$scope.info.makes = data.makes;
	} );

	$scope.scanVIN = function() {
		cordova.plugins.barcodeScanner.scan(
			function( result ) {
				if ( result.text && CarAPI.validateVIN( result.text ) ) {
					$scope.data.vin = result.text;
					$scope.VINLookup( result.text );
				} else {
					$ionicPopup.alert( {
						template: "<p class='center'>Invalid VIN detected. Please try again.</p>"
					} );
				}
			}
		);
	};

	$scope.VINLookup = function( vin, callback ) {
		callback = callback || function() {};
		vin = vin || $scope.data.vin;

		if ( CarAPI.validateVIN( vin ) ) {
			CarAPI.getVINInfo( vin, function( data ) {
				$scope.data.make = $scope.info.makes[ $scope.info.makes.indexOf( filterFilter( $scope.info.makes, { id: data.make.id } )[ 0 ] ) ];
				$scope.data.model = $scope.data.make.models[ $scope.data.make.models.indexOf( filterFilter( $scope.data.make.models, { id: data.model.id } )[ 0 ] ) ];
				$scope.info.years = data.years;
				$scope.data.year = $scope.info.years[ $scope.info.years.indexOf( filterFilter( $scope.info.years, { id: data.years[ 0 ].id } )[ 0 ] ) ];
				if ( data.colors && data.colors.length ) {
					$scope.info.colors = data.colors[ 0 ].options;
				} else {
					$scope.getColors();
				}
			} );
		}
	};

	$scope.updateDetails = function() {
		$scope.info.years = $scope.data.model.years;
	};

	$scope.getColors = function() {
		if ( $scope.data.make.name && $scope.data.model.name && $scope.data.year.year ) {
			CarAPI.getColorForModel( $scope.data.make.name, $scope.data.model.name, $scope.data.year.year, function( data ) {
				$scope.info.colors = data.styles[ 0 ].colors[ 1 ].options;
			} );
		}
	};

	$scope.saveCar = function() {
		console.log( $scope.data );
	};
} )

.controller( "vinCtrl", function( $scope ) {

} )

.controller( "helpCtrl", function( $scope ) {

} );
