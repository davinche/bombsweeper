angular.module('minesweeper').factory('gameUtils', function($interval) {

    // ------------------------------------------------------------------------
    // Tile Class
    // ------------------------------------------------------------------------
    // - used to capture state of the current tile
    // ------------------------------------------------------------------------
    class Tile {
        constructor(row, col, tileValue) {
            this.row = row;
            this.col = col;
            this.value = tileValue || 0;
            this.show = false;
            this.flagged = false;
        }
    }

    // ------------------------------------------------------------------------
    // Get the neighboring tiles given a board and a tile
    // ------------------------------------------------------------------------
    // Params:
    // - board: The game board object
    // - tile: The tile to get neighbors for
    // ------------------------------------------------------------------------
    var getNeighborTiles = (board, tile) => {
        // All possible neighbors
        var possibleNeighbors = [
            {row: tile.row-1, col: tile.col-1},
            {row: tile.row-1, col: tile.col},
            {row: tile.row-1, col: tile.col+1},
            {row: tile.row, col: tile.col-1},
            {row: tile.row, col: tile.col+1},
            {row: tile.row+1, col: tile.col-1},
            {row: tile.row+1, col: tile.col},
            {row: tile.row+1, col: tile.col+1}
        ];

        // Filter for valid neighbors with valid indexes in our board
        return possibleNeighbors.filter(function(possibility) {
            return (
                (0 <= possibility.row && possibility.row < board.length) &&
                (0 <= possibility.col && possibility.col < board[tile.row].length)
            );
        })
        // Map them back to tile objects in our board
        .map(function(tilePosition) {
            return board[tilePosition.row][tilePosition.col];
        });
    };

    // ------------------------------------------------------------------------
    // Create a new board given game settings:
    // ------------------------------------------------------------------------
    // Game settings is an object that contains:
    // - rows (int): Number of rows for the game board
    // - cols (int): Number of cols for the game board
    // - mines (int): Number of mines to be placed on the board
    // ------------------------------------------------------------------------
    var newBoard = (settings) => {
        var mines = settings.mines;

        // Create a new array with all zeros
        // --------------------------------------------------------------------
        // - zeros represent the empty tile on the board
        // --------------------------------------------------------------------
        var board = []
        for (var row=0; row < settings.rows; row++) {
            board.push(
                Array.apply(null, Array(settings.cols))
                .map((curr, col) => {
                    return new Tile(row, col);
                })
            );
        }

        // Track mine tiles
        var mineTiles = [];

        // Randomly insert mines onto the board
        while(mines) {
            let randRow = Math.floor(Math.random() * settings.rows);
            let randCol = Math.floor(Math.random() * settings.cols);
            let tile = board[randRow][randCol];

            // If the tile is empty (aka 0), then make it a mine (mark it as x)
            if (tile.value === 0) {
                tile.value = 'x';
                mineTiles.push(tile);
                mines--;
            }
        }

        // Calculate the numbers for the tiles adjacent to mines
        mineTiles.forEach(function(tile) {
            var neighbors = getNeighborTiles(board, tile);
            neighbors.forEach(function(neighborTile) {
                if (neighborTile.value !== 'x') {
                    neighborTile.value++;
                }
            });
        });

        // Save reference to all of the mine tiles
        board.mines = mineTiles;
        return board;
    };

    // ------------------------------------------------------------------------
    // Create new object to track the current game's state
    // ------------------------------------------------------------------------
    var newGameState = (gameSettings) => {
        var gameState = {
            revealed: 0,
            flagged: 0,
            win: false,
            lose: false,
            elapsed: 0,
            timer: null,
            startTimer: () => {
                gameState.timer = $interval(() => {
                    gameState.elapsed++;
                }, 1000);
            },
            stopTimer: () => {
                if (gameState.timer) {
                    $interval.cancel(gameState.timer);
                }
            }
        };

        // Computed property to for getting remaining mines
        Object.defineProperty(gameState, 'remainingMines', {
            get: () => {
                return gameSettings.mines - gameState.flagged;
            }
        });
        return gameState;
    };

    // Expose Game Utils Functions
    return {
        newBoard: newBoard,
        newGameState: newGameState,
        getNeighborTiles: getNeighborTiles
    }
});
