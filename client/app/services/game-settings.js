angular.module('minesweeper').factory('gameSettings', function() {
    return {
        rows: 16,
        cols: 30,
        mines: 99
    };
});
