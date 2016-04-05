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
} );
