'use strict'

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


function countMinesNegs(board, rowIdx, colIdx) {
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


// // location such as: {i: 2, j: 7}
// function renderCell(location, value) {
//     // Select the elCell and set the value
//     const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
//     elCell.innerHTML = value
// }

// function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }

function findLocationsInBoard(board, item) {
    var locations = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j] === item) locations.push({ i, j })
        }
    }
    return locations
}

// function countItems(board, item) {
//     var count = 0

//     for (var i = 0; i < board.length; i++) {
//         for (var j = 0; j < board[0].length; i++) {
//             if (board[i][j] === item) count++
//         }
//     }
//     return count
// }

// function playSound(soundUrl) {
//     var audio = new Audio(soundUrl);
//     audio.play();
// }

// function shuffleBoard(board) {
//     for (var i = board.length - 1; i > 0; i--) {
//         var j = Math.floor(Math.random() * (i + 1));
//         var temp = board[i];
//         board[i] = board[j];
//         board[j] = temp;
//     }
// }

function getNRandomInts(n) {
    var ints = []
    for (var i = 0; i < n; i++) {
        var currNum = getRandomInt(0, gBoard.length)

        while (ints.includes(currNum)) {
            currNum = getRandomInt(0, gBoard.length)
        }

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


// function createMat(ROWS, COLS) {
//     const mat = []
//     for (var i = 0; i < ROWS; i++) {
//         const row = []
//         for (var j = 0; j < COLS; j++) {
//             row.push('')
//         }
//         mat.push(row)
//     }
//     return mat
// }