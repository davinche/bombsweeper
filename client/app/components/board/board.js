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
            // Handle click and double vs doubleclick
            // ----------------------------------------------------------------
            // Doubleclicking a tile that has already been revealed and the
            // number of flagged tiles match the number
            // ----------------------------------------------------------------
            this.handleClick = (tile, clickCount) => {
                if (!tile.show) {
                    this.showTile(tile);
                // Reveal all unkonwn surrounding tiles on double click
                // of an already revealed tile
                } else if (tile.show && tile.value !== 'x' && tile.value > 0
                           && clickCount > 1) {

                    var neighbors = gameUtils.getNeighborTiles(this.model(), tile);
                    var numFlagged = neighbors.filter((nTile) => {
                        return nTile.flagged;
                    }).length;

                    // Reveal neighbors if the tile value and the
                    // number of flagged neighbors match
                    if (numFlagged === tile.value) {
                        neighbors.filter((nTile) => {
                            return !(nTile.show || nTile.flagged);
                        }).forEach((neighborTile) => {
                            this.showTile(neighborTile);
                            if(!(this.win() || this.lose())) {
                                this.handleClick(neighborTile, 2);
                            }
                        });
                    }
                }
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
