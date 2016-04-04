angular.module( "app.services", [] )

.factory( "CarAPI", [ "$injector", "$rootScope", function( $injector, $rootScope ) {
	var token = "63db4mypzb27b768uj4xp5qt",
		$http;

	return {
        validateVIN: function( vin ) {
            return vin.match( /[A-HJ-NPR-Z0-9]{17}/ ) ? true : false;
        },
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
        getVINInfo: function( vin, callback ) {
            $http = $http || $injector.get( "$http" );

            $http( {
                method: "GET",
                url: "https://api.edmunds.com/api/vehicle/v2/vins/" + vin + "?fmt=json&api_key=" + token
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
                url: "http://104.131.184.55:3000/companies"
            } ).then(
                function( result ) {
                    callback( result.data );
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

