'use strict'

function findObjMines(board) {
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

// --------------------------------------------------------------


function findLocationsInBoard(board, item) {
    var locations = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j] === item) locations.push({ i, j })
        }
    }
    return locations
}

function getRandLocations(count) {
    var locations = []
    var randomInts = getNRandomInts(count ** 2)

    for (var i = 0; i < count; i++) {
        var location = {
            i: randomInts.pop(),
            j: randomInts.pop()
        }

        locations.push(location)

        for (var x = 0; x < locations.length - 1; x++) {

            while (locations[x].i === location.i &&
                locations[x].j === location.j) {
                // console.log('dupe', location.i, location.j, locations[x].i, locations[x].j)

                locations.pop()

                location = {
                    i: randomInts.pop(),
                    j: randomInts.pop()
                }

                locations.push(location)

            }
        }


    }

    return locations
}

function getNRandomInts(n) {
    var ints = []
    for (var i = 0; i < n; i++) {
        var currNum = getRandomInt(0, gBoard.length)
        ints.push(currNum)
    }
    return ints
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
