angular.module( "app.controllers", [] )

.controller( "homeCtrl", function( $scope, $rootScope, $ionicPopover, $ionicModal, $filter, CarAPI ) {
	var filterFilter = $filter( "filter" ),
		orderFilter = $filter( "orderBy" );

	$ionicModal.fromTemplateUrl( "templates/carDetail.html", {
		scope: $scope
	} ).then( function( modal ) {
		$scope.carDetail = modal;
	} );

	$ionicPopover.fromTemplateUrl( "templates/showOptions.html", {
		scope: $scope
	} ).then( function( popover ) {
		$scope.showOptions = popover;
	} );

	$scope.cars = [];
	$scope.data = {};
	$scope.filters = [ "Inventory", "Sold" ];
	$scope.currentFilter = "Inventory";

	$scope.more = function( event, car ) {
		event.stopPropagation();
		$scope.currentCar = car;
		$scope.showOptions.show( event );
	};

	$scope.updateView = function() {
		CarAPI.getCars( function( data ) {
			if ( data ) {
				$scope.cars = data;
				$scope.setFilter( $scope.currentFilter );
			} else {
				$scope.cars = [];
			}
			$scope.$broadcast( "scroll.refreshComplete" );
		} );
	};

	$scope.showCar = function( car ) {
		$scope.currentCar = car;
		$scope.currentCar.purchaserName = filterFilter( $rootScope.companies, { gdn: car.purchaser } )[ 0 ].name;
		$scope.carDetail.show();
	};

	$scope.setFilter = function( filter ) {
		if ( $scope.currentFilter === filter ) {
			filter = "Inventory";
		}

		$scope.currentFilter = filter;

		if ( filter === "Inventory" ) {
			$scope.filtered = $scope.cars;
		} else if ( filter === "Sold" ) {
			$scope.filtered = filterFilter( $scope.cars, { isSold: 1 } );
		}

		$scope.applyFilters();
	};

	$scope.applyFilters = function() {
		$scope.filtered = filterFilter( $scope.filtered, $scope.data.search );
	};

	// If the user or organization changed, update data on next view
	$scope.$on( "$ionicView.beforeEnter", $scope.updateView );

	// Cleanup the modal when we're done with it
	$scope.$on( "$destroy", function() {
		$scope.carDetail.remove();
		$scope.showOptions.remove();
	} );
} )

.controller( "stockInVehicleCtrl", function( $scope, $rootScope, $interval, $window, $filter, $ionicHistory, $ionicPopup, CarAPI ) {
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

	if ( $rootScope.companies ) {
		$scope.info.companies = $rootScope.companies;
	} else {
		var cancel = $interval( function() {
			if ( $rootScope.companies ) {
				$scope.info.companies = $rootScope.companies;
				$interval.cancel( cancel );
				cancel = undefined;
			}
		}, 100 );
	}

	$scope.scanVIN = function() {
		CarAPI.scanVIN( function( vin ) {
			$scope.data.vin = result.text;
			$scope.VINLookup( result.text );
		} );
	};

	$scope.VINLookup = function( vin ) {
		vin = vin || $scope.data.vin;

		CarAPI.getVINInfo( vin, function( data ) {
			if ( !data ) {
				return;
			}

            $scope.data.make = $scope.info.makes[ $scope.info.makes.indexOf( filterFilter( $scope.info.makes, { id: data.make } )[ 0 ] ) ];
            $scope.data.model = $scope.data.make.models[ $scope.data.make.models.indexOf( filterFilter( $scope.data.make.models, { id: data.model } )[ 0 ] ) ];
            $scope.info.years = data.years;
            $scope.data.year = $scope.info.years[ $scope.info.years.indexOf( filterFilter( $scope.info.years, { id: data.years[ 0 ].id } )[ 0 ] ) ];
            if ( !data.colors ) {
                $scope.getColors();
            }
		} );
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

	$scope.data = {};

	$scope.scanVIN = function() {
		CarAPI.scanVIN( function( vin ) {
			$scope.data.vin = result.text;
			$scope.VINLookup( result.text );
		} );
	};

} )

.controller( "helpCtrl", function( $scope ) {

} )

.controller( "menuCtrl", function( $scope, $ionicSideMenuDelegate ) {

		// Function to close the menu which is fired after a side menu link is clicked.
		// This is done instead of using the menu-close directive to preserve the root history stack
	    $scope.closeMenu = function() {
            $ionicSideMenuDelegate.toggleLeft( false );
	    };
} );
