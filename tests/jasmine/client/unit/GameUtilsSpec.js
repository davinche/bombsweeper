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
        it('generates a board with the given number of mines given game settings', () => {
            var gameSettings = {
                rows: 10,
                cols: 10,
                mines: 10
            };
            var board = gameUtils.newBoard(gameSettings);
            expect(board.mines.length).toBe(10);

            // Count it ourselves
            var numMines = 0;
            board.forEach((row) => {
                row.forEach((tile) => {
                    if (tile.value === 'x') {
                        numMines++;
                    }
                });
            });
            expect(numMines).toBe(10);
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
