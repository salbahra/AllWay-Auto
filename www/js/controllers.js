angular.module( "app.controllers", [] )

.controller( "homeCtrl", function( $scope, $rootScope, $ionicPopover, $ionicPopup, $ionicModal, $filter, CarAPI ) {
	var filterFilter = $filter( "filter" ),
		orderFilter = $filter( "orderBy" );

	$ionicModal.fromTemplateUrl( "templates/carDetail.html", {
		scope: $scope
	} ).then( function( modal ) {
		$scope.carDetail = modal;
	} );

	$ionicModal.fromTemplateUrl( "templates/sellCar.html", {
		scope: $scope
	} ).then( function( modal ) {
		$scope.sellCar = modal;
	} );

	$ionicPopover.fromTemplateUrl( "templates/showOptions.html", {
		scope: $scope
	} ).then( function( popover ) {
		$scope.showOptions = popover;
	} );

	$scope.avatar = {
		image: false,
		cropped: false
	};

	$scope.cars = [];
	$scope.data = {};
	$scope.filters = [ "Inventory", "Sold" ];
	$scope.currentFilter = "Inventory";

	$scope.more = function( event, car ) {
		event.stopPropagation();
		$scope.currentCar = car;
		$scope.showOptions.show( event );
	};

	$scope.uploadPhoto = function( event, vin ) {
		event.stopPropagation();
		var fileInput = angular.element( "#carImage" );
		fileInput.one( "change", function() {

			var file = fileInput[ 0 ].files[ 0 ];

			if ( !file.type || !file.type.match( "image.*" ) ) {
				return;
			}

			var formData = new FormData();
			formData.append( "carImage", file );
			formData.append( "vin", vin );

			CarAPI.uploadCarImage( formData, function( result ) {
				var image = angular.element( event.target ).parent().siblings( "img" )[ 0 ];
				image.src = "http://104.131.184.55:3000/getCarImage/" + vin + "?date=" + new Date().getTime();
			} );
		} );

		fileInput.click();
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

	$scope.showCarModal = function( car ) {
		$scope.currentCar = car;
		$scope.sellCar.show();
	};

	$scope.callbackMethod = function( query, isInitializing ) {
		if ( query.length < 3 ) {
			return [];
		}
		return filterFilter( $rootScope.companies, { name: query } );
	};

	$scope.setFilter = function( filter ) {
		if ( $scope.currentFilter === filter ) {
			filter = "Inventory";
		}

		$scope.currentFilter = filter;

		if ( filter === "Inventory" ) {
			$scope.filtered = filterFilter( $scope.cars, { isSold: 0 } );
		} else if ( filter === "Sold" ) {
			$scope.filtered = filterFilter( $scope.cars, { isSold: 1 } );
		}

		$scope.applyFilters();
	};

	$scope.applyFilters = function() {
		$scope.filtered = filterFilter( $scope.filtered, $scope.data.search );
	};

	$scope.markAsSold = function() {
		$scope.sellCar.hide();
		CarAPI.markAsSold( {
			vin: $scope.currentCar.vin,
			isSold: 1,
			sellOdometer: $scope.data.sellOdometer,
			sellDate: $scope.data.sellDate,
			sellPrice: $scope.data.sellPrice,
			seller: $scope.data.seller,
			sellNotes: $scope.data.sellNotes
		}, function( result ) {
			if ( result ) {
				$ionicPopup.alert( {
					template: "<p class='center'>Car has succesfully been marked as sold.</p>"
				} ).then( $scope.updateView );
			}
		} );
	};

	$scope.removeSaleStatus = function() {
		CarAPI.updateCar( {
			vin: $scope.currentCar.vin,
			isSold: 0,
			sellOdometer: null,
			sellDate: null,
			sellPrice: null,
			seller: null,
			sellNotes: null
		}, function( result ) {
			if ( result ) {
				$ionicPopup.alert( {
					template: "<p class='center'>Car has succesfully been moved back to inventory.</p>"
				} ).then( $scope.updateView );
			}
		} );
	};

	// If the user or organization changed, update data on next view
	$scope.$on( "$ionicView.beforeEnter", $scope.updateView );

	// Cleanup the modal when we're done with it
	$scope.$on( "$destroy", function() {
		$scope.carDetail.remove();
		$scope.showOptions.remove();
		$scope.sellCar.remove();
	} );
} )

.controller( "stockInVehicleCtrl", function( $scope, $stateParams, $rootScope, $window, $filter, $ionicHistory, $ionicPopup, CarAPI ) {
	var filterFilter = $filter( "filter" );

	$scope.hasCamera = $window.cordova ? true : false;

	$scope.reset = function() {
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
	};

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

            $scope.data.make = data.make;
            $scope.data.model = data.model;
            $scope.info.years = data.model.years;
            $scope.data.year = data.year;
            if ( data.color ) {
				$scope.data.color = data.color;
            } else {
                $scope.getColors();
            }
		} );
	};

	$scope.updateDetails = function() {
		$scope.info.years = $scope.data.model.years;
	};

	$scope.getColors = function( callback ) {
		callback = callback || function() {};

		if ( $scope.data.make.name && $scope.data.model.name && $scope.data.year.year ) {
			CarAPI.getColorForModel( $scope.data.make.name, $scope.data.model.name, $scope.data.year.year, function( data ) {
				$scope.info.colors = data.styles[ 0 ].colors[ 1 ].options;
				callback();
			} );
		}
	};

	$scope.callbackMethod = function( query, isInitializing ) {
		if ( query.length < 3 ) {
			return [];
		}
		return filterFilter( $rootScope.companies, { name: query } );
	};

	$scope.saveCar = function() {
		var current = {
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
		};

		var send = $scope.isNew ? CarAPI.addCar : CarAPI.updateCar;
		send( current, function( result ) {
			var type = $scope.isNew ? "add" : "updat",
				msg = "Car " + type + "ed succesfully!";

			if ( !result ) {
				msg = "Unable to " + type + " vehicle. Please try again.";
			}

			$ionicPopup.alert( {
				template: "<p class='center'>" + msg + "</p>"
			} );
			$ionicHistory.goBack();
		} );
	};

	// If the user or organization changed, update data on next view
	$scope.$on( "$ionicView.beforeEnter", function() {
		var car = $stateParams.car;

		if ( car ) {
			$scope.reset();
			$scope.data.vin = car.vin,
			$scope.data.make = filterFilter( $rootScope.makes, { name: car.make } )[ 0 ];
			$scope.data.model = $scope.data.make.models[ $scope.data.make.models.indexOf( filterFilter( $scope.data.make.models, { name: car.model } )[ 0 ] ) ];
			$scope.info.years = $scope.data.model.years;
			$scope.data.year = $scope.info.years[ $scope.info.years.indexOf( filterFilter( $scope.info.years, { year: car.year } )[ 0 ] ) ];
			if ( car.color ) {
				$scope.getColors( function() {
					$scope.data.color = $scope.info.colors[ $scope.info.colors.indexOf( filterFilter( $scope.info.colors, { name: car.color } )[ 0 ] ) ];
				} );
			}
			$scope.data.purchaser = filterFilter( $rootScope.companies, { gdn: car.purchaser } )[ 0 ].name;
			$scope.data.odometer = car.odometer;
			$scope.data.purchaseDate = new Date( car.purchaseDate.substring( 0, 10 ) );
			$scope.data.purchasePrice = car.purchasePrice;
			$scope.data.notes = car.notes;
			$scope.isNew = false;
		} else {
			$scope.reset();
			$scope.isNew = true;
		}
	} );
} )

.controller( "vinCtrl", function( $scope, $window, CarAPI ) {

	$scope.data = {};
	$scope.hasCamera = $window.cordova ? true : false;

	$scope.scanVIN = function() {
		CarAPI.scanVIN( function( vin ) {
			$scope.data.VIN = result.text;
			$scope.VINLookup( result.text );
		} );
	};

	$scope.VINLookup = function( vin ) {
		vin = vin || $scope.data.VIN;

		CarAPI.getVINInfo( vin, function( data ) {
			if ( !data ) {
				return;
			}
			$scope.data.make = data.make;
			$scope.data.model = data.model;
			$scope.data.year = data.year;
			if ( data.color ) {
				$scope.data.color = data.color;
			}
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
