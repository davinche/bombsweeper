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
            var clickTimeout = null;

            // Apply flag to tile
            var applyFlag = () => {
                $timeout.cancel(clickTimeout);
                clickTimeout = null;
                scope.$apply(() => {
                    scope.onFlag(scope.model());
                });
            };

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

            elem.bind('click', leftClickHandler);

            // Right-click (or control left-click) should apply flag to tile.
            elem.bind('contextmenu', applyFlag);

            // Cleanup
            scope.$on('$destroy', function() {
                elem.unbind('click', leftClickHandler);
                if (clickTimeout) {
                    $timeout.cancel(clickTimeout);
                    clickTimeout = null;
                }
            });
        }
    };
});
