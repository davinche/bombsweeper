angular.module('minesweeper').directive('tile', function($timeout) {
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

            var clickTimeout = null;
            var leftClickHandler = (e) => {
                // Make sure it is a left click
                if (!clickTimeout) {
                    clickTimeout = $timeout(() => {
                        scope.onClick()(scope.model(), 1);
                    }, 150);
                } else {
                    scope.onClick()(scope.model(), 2);
                    $timeout.cancel(clickTimeout);
                    clickTimeout = null;
                }
            };

            elem.bind('mousedown', rightClickHandler);
            elem.bind('click', leftClickHandler);

            // Cleanup
            scope.$on('$destroy', function() {
                elem.unbind('mousedown', rightClickHandler);
                elem.unbind('click', leftClickHandler);
                if (clickTimeout) {
                    $timeout.cancel(clickTimeout);
                    clickTimeout = null;
                }
            });
        }
    };
});
