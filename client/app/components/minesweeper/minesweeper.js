angular.module('minesweeper').directive('minesweeper', function() {
    return {
        restrict: 'E',
        scope: {},
        controllerAs: 'game',
        templateUrl: 'client/app/components/minesweeper/minesweeper.html',
        bindToController: true,
        controller: function(gameUtils, gameSettings) {
            // ----------------------------------------------------------------
            // Game Config
            // ----------------------------------------------------------------
            var ctrl = this;
            this.width = gameSettings.cols * 30 + 'px';

            // ----------------------------------------------------------------
            // Win Condition
            // ----------------------------------------------------------------
            var checkWin = () => {
                var numTiles = gameSettings.cols * gameSettings.rows;
                // Win if all squares all 'non-mine' squares are revealed
                if (ctrl.state.revealed === numTiles - gameSettings.mines) {
                    ctrl.state.win = true;
                    ctrl.state.stopTimer();
                    return;
                }
                // Win if all of the mines are in the correct place
                if (ctrl.state.remainingMines === 0) {
                    // Win if all of the mined tiles are flagged
                    let win = ctrl.board.mines.every((tile) => {
                        return tile.flagged;
                    });
                    if (win) {
                        ctrl.state.stopTimer();
                        ctrl.state.win = true;
                    }
                }
            };

            // ----------------------------------------------------------------
            // Game Over
            // ----------------------------------------------------------------
            var gameover = () => {
                ctrl.board.mines.forEach((mine) => {
                    ctrl.state.stopTimer();
                    // show all the mines (like the original minesweeper)
                    mine.show = true;
                    // Declare loss
                    ctrl.state.lose = true;
                });
            };

            // ----------------------------------------------------------------
            // Tile Input (show or flag a tile)
            // ----------------------------------------------------------------

            // Handle showing a tile
            var showTile = (tile) => {
                if (tile.show || tile.flagged) {
                    // Tile already visible; do nothing
                    return;
                }

                // We have not started the game yet
                if (!ctrl.state.timer) {
                    // fill the new board with mines and start the timer
                    gameUtils.fillMines(ctrl.board, gameSettings, tile);
                    ctrl.state.startTimer();
                }

                if (tile.value === 'x') {
                    gameover();
                } else {
                    tile.show = true;
                    tile.flagged = false;
                    ctrl.state.revealed++;
                    checkWin();
                }
            };

            // Handle flipping the flagged attribute on a tile
            var flagTile = (tile) => {
                if (tile.show) {
                    // Tile already visible; do nothing
                    return;
                }
                tile.flagged = !tile.flagged;
                // track the number of flagged tiles
                if (tile.flagged) {
                    ctrl.state.flagged++;
                } else {
                    ctrl.state.flagged--;
                }
                checkWin();
            };

            // Handle new game action
            this.newGame = () => {
                ctrl.board = gameUtils.newBoard(gameSettings);
                ctrl.state = gameUtils.newGameState(gameSettings);
            };

            // ----------------------------------------------------------------
            // Game Action Handler
            // ----------------------------------------------------------------
            // Handle User Input Intents
            // ----------------------------------------------------------------
            this.action = (action) => {
                switch(action.type) {
                    case 'SHOW':
                        showTile(action.tile);
                        break;
                    case 'FLAG':
                        flagTile(action.tile);
                        break;
                    case 'NEW':
                        ctrl.newGame();
                        break;
                    default:
                        throw 'unknown action type';
                }
            };

            // Start the game
            this.newGame();
        }
    };
});
