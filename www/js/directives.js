angular.module( "app.directives", [] )

.directive( "hires", function() {
	return {
		restrict: "A",
		scope: { hires: "@" },
		link: function( scope, element ) {
			var holder = element[ 0 ].src;

			element.one( "load", function() {
				element.attr( "src", scope.hires );
			} );

            // Listen for errors on the element and if there are any replace the source with the fallback source
            element.on( "error", function() {
                element.off( "error" );
                if ( element[ 0 ].src !== holder ) {
                    element[ 0 ].src = holder;
                }
            } );
		}
	};
} )

.directive( "onValidSubmit", function( $parse ) {
	return {
		restrict: "A",
		require: "^form",
		link: function( scope, element, attrs, form ) {
			var fn = $parse( attrs.onValidSubmit );
			element.on( "submit", function( event ) {
				if ( form.$valid && typeof fn === "function" ) {
					fn( scope, { $event: event } );
				}
			} );
		}
	};
} );
