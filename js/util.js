'use strict'

function findRandomSafeLocation() {
    var isFoundSafeLocation = false

    while (!isFoundSafeLocation) {
        var i = getRandomInt(0, gBoard.length)
        var j = getRandomInt(0, gBoard[0].length)
        var currCell = gBoard[i][j]

        if (!currCell.isShown && !currCell.isMine) isFoundSafeLocation = true

        else if (gGame.shownCount + gLevel.MINES === gLevel.SIZE * gLevel.SIZE) {
            isFoundSafeLocation = true
            return null
        }
    }

    return { i, j }
}

function resetTimer() {
    clearInterval(gTimerIntervalId)
    gTimerIntervalId = 0
    renderTimer()
}

function startTimer() {
    var start = Date.now();
    gTimerIntervalId = setInterval(() => {
        var delta = Date.now() - start;
        gSecsPassed = Math.round(delta / 1000)
        renderTimer()
    }, 1);
}

function findMinesInBoard(board) {
    var allMineCells = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            if (currCell.isMine) allMineCells.push(currCell)
        }
    }

    return allMineCells
}

//Neighbors loops:
function findNegsLocations(board, location) {
    var negLocations = []

    for (var i = location.i - 1; i <= location.i + 1; i++) {

        if (i < 0 || i >= board.length) continue

        for (var j = location.j - 1; j <= location.j + 1; j++) {

            if (i === location.i && j === location.j) continue
            if (j < 0 || j >= board[0].length) continue

            negLocations.push({ i, j })
        }
    }

    return negLocations
}

function countMines(board, rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue

            if (board[i][j].isMine) count++
        }
    }

    return count
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}