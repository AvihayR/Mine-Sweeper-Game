'use strict'

var MINE = '💣'
var gBoard

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}


function onInit() {
    gGame.isOn = true
    gBoard = buildBoard()
    // randomizeMines()
    setMinesNegsCount(gBoard)
    renderBoard()
}

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    gBoard[i][j].isShown = true

    if (gBoard[i][j].isMine) {
        gameOver(elCell)
    }

    expandLoneCell({ i, j })
    renderBoard()

}


function gameOver(elCell) {
    console.log('Game over!')
    gGame.isOn = false
}


function expandLoneCell(location) {
    const mineCount = countMinesNegs(gBoard, location.i, location.j)
    if (mineCount > 0) return
    const negLocations = findNegsLocations(gBoard, location)

    for (var i = 0; i < negLocations.length; i++) {
        const currLocation = negLocations[i]
        gBoard[currLocation.i][currLocation.j].isShown = true
    }
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            const mineCount = countMinesNegs(board, i, j)

            cell.minesAroundCount = mineCount
        }
    }
}

function renderBoard() {
    var strHTML = ''

    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            strHTML += `<td data-i="${i}" data-j="${j}" onclick="onCellClicked(this, ${i}, ${j})">`

            if (currCell.isShown && currCell.isMine) strHTML += MINE
            else if (currCell.isShown) strHTML += currCell.minesAroundCount

            strHTML += '</td>'
        }

        strHTML += '</tr>'
    }

    const elBody = document.querySelector('table.board tbody')
    elBody.innerHTML = strHTML

    renderCellsColor()
}

function renderCellsColor() {
    //DOM
    const elTds = document.querySelectorAll('td')
    for (var i = 0; i < elTds.length; i++) {
        const currTd = elTds[i]
        const currCellModel = gBoard[currTd.dataset.i][currTd.dataset.j]
        //Model
        if (currCellModel.isMine && currCellModel.isShown) currTd.classList.add('boom')
        else if (currCellModel.isShown) currTd.classList.add('shown')
    }
}

function randomizeMines() {
    // const firstNum = getRandomInt(0, gBoard.length)
    // const secondNum = getRandomInt(0, gBoard.length)
    var locations = []
    var randomInts = getNRandomInts(gLevel.MINES * 2)

    for (var i = 0; i < gLevel.MINES; i++) {

        const location = {
            i: randomInts.pop(),
            j: randomInts.pop()
        }

        locations.push(location)
    }

    for (var i = 0; i <= locations.length; i++) {
        const currLocation = locations.pop()
        gBoard[currLocation.i][currLocation.j].isMine = true
        // gBoard[currLocation.i][currLocation.j].isShown = true
    }

}

function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        const row = []
        for (var j = 0; j < gLevel.SIZE; j++) {

            var cell = {
                minesAroundCount: 0,
                isShown: false,
                // isShown: true,
                isMine: false,
                isMarked: false
            }

            //comment later:
            if (i === 0 && j === 2 || i == 2 && j === 3) {
                cell.isMine = true
                // cell.isShown = true
            }

            row.push(cell)
        }
        board.push(row)
    }
    return board
}

