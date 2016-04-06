angular.module( "app.controllers", [] )

.controller( "homeCtrl", function( $scope, CarAPI ) {
	$scope.cars = [];

	// If the user or organization changed, update data on next view
	$scope.$on( "$ionicView.beforeEnter", function() {
		CarAPI.getCars( function( data ) {
			if ( data ) {
				$scope.cars = data;
			} else {
				$scope.cars = [];
			}
		} );
	} );
} )

.controller( "stockInVehicleCtrl", function( $scope, $window, $filter, $ionicHistory, $ionicPopup, CarAPI ) {
	var filterFilter = $filter( "filter" );

	$scope.hasCamera = $window.cordova ? true : false;

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

	CarAPI.getCompanies( function( data ) {
		$scope.info.companies = data;
	} );

	$scope.scanVIN = function() {
		cordova.plugins.barcodeScanner.scan(
			function( result ) {
				if ( result.text ) {
					if ( result.text.charAt( 0 ).toLowerCase() === "i" ) {
						result.text = result.text.substring( 1 );
					}
					if ( CarAPI.validateVIN( result.text ) ) {
						$scope.data.vin = result.text;
						$scope.VINLookup( result.text );
					} else if ( !result.cancelled ) {
						$ionicPopup.alert( {
							template: "<p class='center'>Invalid VIN detected. Please try again.</p>"
						} );
					}
				}
			}
		);
	};

	$scope.VINLookup = function( vin, callback ) {
		callback = callback || function() {};
		vin = vin || $scope.data.vin;

		if ( CarAPI.validateVIN( vin ) ) {
			CarAPI.getVINInfo( vin, function( data, error ) {
				if ( !data && error === "" ) {
					$ionicPopup.alert( {
						template: "<p class='center'>" + error.message + "</p>"
					} );
					return;
				};
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

	$scope.callbackMethod = function( query, isInitializing ) {
		if ( query.length < 3 ) {
			return [];
		}
		return filterFilter( $scope.info.companies, { name: query } );
	};

	$scope.saveCar = function() {
		CarAPI.addCar( {
			vin: $scope.data.vin,
			make: $scope.data.make.name,
			model: $scope.data.model.name,
			year: $scope.data.year.year,
			color: $scope.data.color.name,
			purchaser: $scope.data.purchaser,
			odometer: $scope.data.odometer,
			purchaseDate: $scope.data.purchaseDate,
			purchasePrice: $scope.data.purchasePrice,
			notes: $scope.data.notes
		}, function( result ) {
			var msg = "Car added succesfully!";

			if ( !result ) {
				msg = "Unable to add vehicle. Make sure the VIN is unique and try again.";
			}

			$ionicPopup.alert( {
				template: "<p class='center'>" + msg + "</p>"
			} );
			$ionicHistory.goBack();
		} );
	};
} )

.controller( "vinCtrl", function( $scope ) {

} )

.controller( "helpCtrl", function( $scope ) {

} );
