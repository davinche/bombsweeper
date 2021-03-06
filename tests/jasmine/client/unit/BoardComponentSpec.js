describe('BoardComponent', () => {
    var $injector, $compile, board, scope, boardCtrl, tile;
    beforeEach(() => {
        module('minesweeper');
        var gameSettings = {
            rows: 10,
            cols: 10,
            mines: 10
        };
        inject(function(_$injector_) {
            $injector = _$injector_;
            $compile = $injector.get('$compile');
        });

        board = $injector.get('gameUtils').newBoard(gameSettings);
        tile = board[0][0];
        var $scope = $injector.get('$rootScope').$new();
        $scope.board = board;
        $scope.action = function() {};
        var elem = $compile('<board model="board" on-action="action"></board>')($scope);
        $scope.$digest();
        scope = elem.isolateScope();
        boardCtrl = scope.board;
        boardCtrl.onAction = function() {};
    });

    describe('handle left click', () => {
        it('clicks an unrevealed tile', () => {
            tile.value = 1;
            spyOn(boardCtrl, 'showTile');
            boardCtrl.handleClick(tile, 1);
            expect(boardCtrl.showTile).toHaveBeenCalled();
        });

        it('should not reveal an aleady shown tile', () => {
            tile.value = 1;
            tile.show = true
            spyOn(boardCtrl, 'showTile');
            boardCtrl.handleClick(tile, 1);
            expect(boardCtrl.showTile).not.toHaveBeenCalled();
        });

        it('reveals neighbors if neighboring flagged tiles match the current tile value', () => {
            var gameUtils = $injector.get('gameUtils');
            tile.value = 1;
            tile.show = true
            var neighbors = gameUtils.getNeighborTiles(board, tile);
            neighbors[0].flagged = true;
            spyOn(boardCtrl, 'showTile');
            boardCtrl.handleClick(tile, 2);
            expect(boardCtrl.showTile).toHaveBeenCalled();
        });

        it('does nothing if the number of flagged neighbor tiles does not equal the current tile value', () => {
            var gameUtils = $injector.get('gameUtils');
            tile.value = 1;
            tile.show = true
            var neighbors = gameUtils.getNeighborTiles(board, tile);
            spyOn(boardCtrl, 'showTile');
            boardCtrl.handleClick(tile, 2);
            expect(boardCtrl.showTile).not.toHaveBeenCalled();
        });
    });

    describe('show tile', () => {
        it('should intend send an intention to reveal a tile', () => {
            tile.value = 1;
            spyOn(boardCtrl, 'onAction');
            boardCtrl.showTile(tile);
            expect(boardCtrl.onAction).toHaveBeenCalled();
            expect(boardCtrl.onAction).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    action: jasmine.objectContaining({
                        type: 'SHOW'
                    })
                })
            );
        });

        it('should reveal surrounding tiles if current tile is an empty tile', () => {
            tile.value = 0;
            board[0][1].value = 1;
            board[1][0].value = 1;
            board[1][1].value = 1;
            spyOn(boardCtrl, 'onAction');
            boardCtrl.showTile(tile);
            expect(boardCtrl.onAction).toHaveBeenCalled();
            expect(boardCtrl.onAction.calls.count()).toBe(4);
        });
    });

    describe('flag tile', () => {
        it('should submit an intent to flag a tile', () => {
            spyOn(boardCtrl, 'onAction');
            boardCtrl.flagTile(tile);
            expect(boardCtrl.onAction).toHaveBeenCalled();
            expect(boardCtrl.onAction).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    action: jasmine.objectContaining({
                        type: 'FLAG'
                    })
                })
            );
        });
    });

    describe('new game', () => {
        it('should submit an intent to create a new game', () => {
            spyOn(boardCtrl, 'onAction');
            boardCtrl.newGame(tile);
            expect(boardCtrl.onAction).toHaveBeenCalled();
            expect(boardCtrl.onAction).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    action: jasmine.objectContaining({
                        type: 'NEW'
                    })
                })
            );
        });
    });
});
