describe('MinesweeperComponent', () => {
    var $injector, $compile, scope, ctrl;
    beforeEach(() => {
        var gameSettings = {
            rows: 10,
            cols: 10,
            mines: 10
        };
        module('minesweeper');
        // Mock game settings
        module(function($provide) {
            $provide.value('gameSettings', gameSettings);
        });
        inject(function(_$injector_) {
            $injector = _$injector_;
            $compile = $injector.get('$compile');
            var $scope = $injector.get('$rootScope').$new();
            var element = $compile('<minesweeper></minesweeper>')($scope);
            $scope.$digest();
            scope = element.isolateScope();
            ctrl = scope.game;
        });
    });

    describe('ComponentWidth', () => {
        it('should be scaled based on the number of column tiles per row', () => {
            expect(ctrl.width).toBe('300px');
        });
    });

    describe('Showing a tile', () => {
        var tile;
        beforeEach(() => {
            tile = ctrl.board[0][0];
        });

        it('should reveal a hidden tile', () => {
            // Manually set a revealable tile
            tile.value = 1;
            expect(tile.show).toBe(false);
            ctrl.action({type: 'SHOW', tile: tile});
            expect(tile.show).toBe(true);
        });

        it('should end the game if a bomb is clicked', () => {
            // Manually set the tile to be a bomb
            tile.value = 'x';
            expect(ctrl.state.lose).toBe(false);
            ctrl.action({type: 'SHOW', tile: tile});
            expect(ctrl.state.lose).toBe(true);
        });

        it('should start the timer if it is the first click', () => {
            expect(ctrl.state.timer).toBeNull();
            spyOn(ctrl.state, 'startTimer').and.callThrough();
            ctrl.action({type: 'SHOW', tile: tile});
            expect(ctrl.state.startTimer).toHaveBeenCalled();
            expect(ctrl.state.timer).not.toBeNull();
        });

        it('should not start the timer again if it is not the first click', () => {
            ctrl.state.timer = 'not null';
            spyOn(ctrl.state, 'startTimer').and.callThrough();
            ctrl.action({type: 'SHOW', tile: tile});
            expect(ctrl.state.startTimer).not.toHaveBeenCalled();
        });
    });

    describe('Flagging a tile', () => { 
        var tile;
        beforeEach(() => {
            tile = ctrl.board[0][0];
        });
        it('should flag a tile if it is currently not flagged', () => {
            expect(tile.flagged).toBe(false);
            ctrl.action({type: 'FLAG', tile: tile});
            expect(tile.flagged).toBe(true);
        });

        it('should not flag an already revealed tile', () => {
            tile.show = true;
            tile.flagged = false;
            ctrl.action({type: 'FLAG', tile: tile});
            expect(tile.flagged).toBe(false);
        });

        it('should remove the flag on an already flagged tile', () => {
            tile.flagged = true;
            ctrl.action({type: 'FLAG', tile: tile});
            expect(tile.flagged).toBe(false);
        });
    });

    describe('New Game', () => {
        it('should get a new board on new game', () => {
            var board = ctrl.board;
            ctrl.action({type: 'NEW'});
            expect(board).not.toBe(ctrl.board);
        });

        it('should have no revealed tiles on a new board', () => {
            ctrl.action({type: 'NEW'});
            var revealedTiles = false;
            ctrl.board.forEach((row) => {
                row.forEach((tile) => {
                    if (tile.show) {
                        revealedTiles = true;
                    }
                });
            });
            expect(revealedTiles).toBe(false);
        });

        it('should create a new game state', () => {
            var gameState = ctrl.state;
            ctrl.action({type: 'NEW'});
            expect(gameState).not.toBe(ctrl.state);
        });

        it('should reset the game state', () => {
            ctrl.action({type: 'NEW'});
            var state = ctrl.state;
            expect(state.revealed).toBe(0);
            expect(state.flagged).toBe(0);
            expect(state.win).toBe(false);
            expect(state.lose).toBe(false);
            expect(state.elapsed).toBe(0);
            expect(state.timer).toBeNull();
        });
    });
});
