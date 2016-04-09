angular.module( "app.services", [] )

.factory( "CarAPI", [ "$injector", "$rootScope", function( $injector, $rootScope ) {
	var apiBase = "http://104.131.184.55:3000",
        token = "63db4mypzb27b768uj4xp5qt",
		validateVIN = function( vin ) {
            if ( !vin ) {
                return false;
            }
            return vin.toUpperCase().match( /[A-HJ-NPR-Z0-9]{17}/ ) ? true : false;
        },
        $http, $filter, $ionicPopup;

	return {
        validateVIN: validateVIN,
		getAllModels: function( callback ) {
			$http = $http || $injector.get( "$http" );

            $http( {
                method: "GET",
                url: "https://api.edmunds.com/api/vehicle/v2/makes?fmt=json&api_key=" + token
            } ).then(
                function( result ) {
					callback( result.data );
                },
                function() {
                    callback( false );
                }
            );
		},
        getColorForModel: function( make, model, year, callback ) {
            $http = $http || $injector.get( "$http" );

            $http( {
                method: "GET",
                url: "https://api.edmunds.com/api/vehicle/v2/" + make + "/" + model + "/" + year + "/styles?fmt=json&api_key=" + token + "&view=full"
            } ).then(
                function( result ) {
                    callback( result.data );
                },
                function() {
                    callback( false );
                }
            );
        },
        getCompanies: function( callback ) {
            $http = $http || $injector.get( "$http" );

            $http( {
                method: "GET",
                url: apiBase + "/companies"
            } ).then(
                function( result ) {
                    callback( result.data );
                },
                function() {
                    callback( false );
                }
            );
        },
        addCar: function( car, callback ) {
            $http = $http || $injector.get( "$http" );

            $http( {
                method: "POST",
                url: apiBase + "/register/car",
                data: car
            } ).then(
                function( result ) {
                    callback( result.data );
                },
                function() {
                    callback( false );
                }
            );
        },
        updateCar: function( car, callback ) {
            $http = $http || $injector.get( "$http" );

            $http( {
                method: "POST",
                url: apiBase + "/update/car",
                data: car
            } ).then(
                function( result ) {
                    callback( result.data );
                },
                function() {
                    callback( false );
                }
            );
        },
        getCars: function( callback ) {
            $http = $http || $injector.get( "$http" );

            $http( {
                method: "GET",
                url: apiBase + "/cars"
            } ).then(
                function( result ) {
                    callback( result.data );
                },
                function() {
                    callback( false );
                }
            );
        },
        scanVIN: function( callback ) {
            $ionicPopup = $ionicPopup || $injector.get( "$ionicPopup" );

            if ( typeof cordova === "undefined" ) {
                return;
            }

            cordova.plugins.barcodeScanner.scan(
                function( result ) {
                    if ( result.text ) {
                        if ( result.text.charAt( 0 ).toLowerCase() === "i" ) {
                            result.text = result.text.substring( 1 );
                        }
                        if ( validateVIN( result.text ) ) {
                            callback( result.text );
                        } else if ( !result.cancelled ) {
                            $ionicPopup.alert( {
                                template: "<p class='center'>Invalid VIN detected. Please try again.</p>"
                            } );
                        }
                    }
                }
            );
        },
        getVINInfo: function( vin, callback ) {
            if ( validateVIN( vin ) ) {

                $http = $http || $injector.get( "$http" );
                $filter = $filter || $injector.get( "$filter" );

                $http( {
                    method: "GET",
                    url: "https://api.edmunds.com/api/vehicle/v2/vins/" + vin + "?fmt=json&api_key=" + token
                } ).then(
                    function( result ) {
						var filterFilter = $filter( "filter" ),
							make = filterFilter( $rootScope.makes, { id: result.data.make.id } )[ 0 ],
							data = {
								make: make,
								model: make.models[ make.models.indexOf( filterFilter( make.models, { id: result.data.model.id } )[ 0 ] ) ],
								year: result.data.years[ 0 ]
                        };

                        if ( data.colors && data.colors.length ) {
                            data.color = result.data.colors[ 0 ].options;
                        }

                        callback( data );
                    },
                    function( error ) {
                        $ionicPopup.alert( {
                            template: "<p class='center'>" + error.message + "</p>"
                        } );
                        callback( false );
                    }
                );
            } else {
                callback( false );
            }
        },
        uploadCarImage: function( data, callback ) {
            callback = callback || function() {};
            $http = $http || $injector.get( "$http" );

            $http( {
                method: "POST",
                url: apiBase + "/uploadCarImage",
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined
                },
                data: data
            } ).then(
                function() {
                    callback( true );
                },
                function() {
                    callback( false );
                }
            );
        }
	};
} ] )

.service( "BlankService", [ function() {

} ] );

