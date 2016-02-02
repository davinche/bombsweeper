angular.module('minesweeper').directive('tile', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/app/components/tile/tile.html',
        scope: {
            model: '&',
            onClick: '&',
            onFlag: '&'
        },
        link: function(scope, elem) {
            var rightClickHandler = function(e) {
                // Disable Right Click
                e.preventDefault();
                e.stopPropagation();
                // Flag that current tile
                if (e.button === 2) {
                    scope.$apply(() => {
                        scope.onFlag(scope.model());
                    });
                }
            };

            elem.bind('mousedown', rightClickHandler);

            // Cleanup
            scope.$on('$destroy', function() {
                elem.unbind(rightClickHandler);
            });
        }
    };
});
