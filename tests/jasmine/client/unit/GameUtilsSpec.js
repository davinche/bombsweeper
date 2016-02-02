describe('GameUtils', () => {
    var $injector, gameUtils;
    beforeEach(() => {
        module('minesweeper');
        inject(function(_$injector_) {
            $injector = _$injector_;
            gameUtils = $injector.get('gameUtils');
        });
    });

    describe('NewBoard', () => {
        it('generates a board with the proper rows and columns given settings', () => {
            var gameSettings = {
                rows: 10,
                cols: 11,
                mines: 10
            };
            var board = gameUtils.newBoard(gameSettings);
            expect(board.length).toBe(10);
            expect(board[0].length).toBe(11);
        });

        it('generates an empty board', () => {
            var gameSettings = {
                rows: 3,
                cols: 3,
                mines: 2
            };
            var board = gameUtils.newBoard(gameSettings);
            var nonEmpty = false;
            board.forEach((row) => {
                row.forEach((tile) => {
                    if (tile.value !== 0) {
                        nonEmpty = true;
                    }
                });
            });
            expect(nonEmpty).toBe(false);
        });
    });

    describe('FillMines', () => {
        it('fills the board with the correct number of mines', () => {
            var gameSettings = {
                rows: 10,
                cols: 11,
                mines: 10
            };
            var board = gameUtils.newBoard(gameSettings);
            var tile = board[0][0];

            gameUtils.fillMines(board, gameSettings, tile);
            expect(board.mines.length).toBe(gameSettings.mines);

            // Also count it manually
            var mineCount = 0;
            board.forEach((row) => {
                row.forEach((tile) => {
                    if (tile.value === 'x') {
                        mineCount++;
                    }
                });
            });
            expect(mineCount).toBe(gameSettings.mines);
        });

        it('ensures first tile is always empty and neighbors are not bombs', () => {
            var gameSettings = {
                rows: 3,
                cols: 3,
                mines: 1
            };

            var selectedTileOrNeighborIsBomb = false;
            var board = gameUtils.newBoard(gameSettings);
            var tile = board[0][0];
            var neighbors = gameUtils.getNeighborTiles(board, tile);
            if (tile.value !== 0) {
                selectedTileOrNeighborIsBomb = true;
            }
            neighbors.forEach((neighbor) => {
                if (neighbor.value === 'x') {
                    selectedTileOrNeighborIsBomb = true;
                }
            });
            expect(selectedTileOrNeighborIsBomb).toBe(false);
        });

    });

    describe('GetNeighborTiles', () => {
        it('returns the proper neighboring tiles given a selected tile', () => {
            var gameSettings = {
                rows: 10,
                cols: 10,
                mines: 10
            };
            var board = gameUtils.newBoard(gameSettings);
            // Get the first top left tile surrounded by other tiles
            var selectedTile = board[1][1];
            var neighbors = gameUtils.getNeighborTiles(board, selectedTile);
            expect(neighbors.length).toBe(8);
            var expectedNeighborPositions = [
                '0:0', '0:1', '0:2', '1:0',
                '1:2', '2:0', '2:1', '2:2'
            ];
            // Loop through each neighbor and make sure their positions
            // are within the list of expected positions
            var notFound = false;
            var neighborPositions = neighbors.map((tile) => {
                return `${tile.row}:${tile.col}`;
            }).forEach((pos) => {
                if (expectedNeighborPositions.indexOf(pos) < 0) {
                    notFound = true;
                }
            });
            expect(notFound).toBe(false);

            // Test an edge (corner) tile
            selectedTile = board[0][0];
            neighbors = gameUtils.getNeighborTiles(board, selectedTile);
            expect(neighbors.length).toBe(3);

            expectedNeighborPositions = [
                '0:1', '1:0', '1:1'
            ];
            notFound = false;
            neighborPositions = neighbors.map((tile) => {
                return `${tile.row}:${tile.col}`;
            }).forEach((pos) => {
                if (expectedNeighborPositions.indexOf(pos) < 0) {
                    notFound = true;
                }
            });
            expect(notFound).toBe(false);
        });
    });
});
