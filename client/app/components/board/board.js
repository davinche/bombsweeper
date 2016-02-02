angular.module('minesweeper').directive('board', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/app/components/board/board.html',
        scope: {
            'model': '&',
            'onAction': '&',
            'win': '&',
            'lose': '&'
        },
        bindToController: true,
        controllerAs: 'board',
        controller: function(gameUtils) {
            // Wrapper around getNeighbors to additionally filter out
            // all flagged and already revealed tiles
            var getUnknownNeighbors = (tile) => {
                return gameUtils.getNeighborTiles(this.model(), tile)
                    .filter((neighborTile) => {
                        return !(neighborTile.flagged || neighborTile.show);
                    });
            };

            // ----------------------------------------------------------------
            // Reveal a hidden tile
            // ----------------------------------------------------------------
            this.showTile = (tile) => {
                if (tile.show) {
                    // Ignore clicks on already visible tiles
                    return;
                }

                // dispatch the SHOW action on the current tile
                this.onAction({
                    action: { type: 'SHOW', tile: tile }
                });

                // If the tile is an empty tile, recursively show the tile's
                // neighbors as well
                if (tile.value === 0) {
                    getUnknownNeighbors(tile)
                    .forEach((neighborTile) => {
                        this.showTile(neighborTile);
                    });
                }
            };

            // ----------------------------------------------------------------
            // Flag a tile
            // ----------------------------------------------------------------
            this.flagTile = (tile) => {
                this.onAction({
                    action: { type: 'FLAG', tile: tile }
                });
            };

            // ----------------------------------------------------------------
            // Create a New Game
            // ----------------------------------------------------------------
            this.newGame = () => {
                this.onAction({
                    action: { type: 'NEW' }
                });
            };
        }
    };
});
