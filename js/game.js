'use strict'

var MINE = '💣'
var FLAG = '📍'

var gBoard

var gGame = {
    isOn: false,
    isWinner: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isFirstClick: true,
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

function onInit() {
    gGame.isOn = true
    gGame.isWinner = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.isFirstClick = true

    gBoard = buildBoard()
    renderBoard()
}

function onCellClicked(elCell, i, j) {

    if (gGame.isFirstClick) {
        randomizeMines(gBoard, { i, j })
        setMinesNegsCount(gBoard)
        renderBoard()
        gGame.isFirstClick = false
    }
    if (!gGame.isOn) return
    if (gBoard[i][j].isMarked) return
    if (gBoard[i][j].isShown) return

    gBoard[i][j].isShown = true
    gGame.shownCount++

    if (gBoard[i][j].isMine) {
        gameOver()
    }

    expandShown({ i, j })
    renderBoard()
    checkGameOver()
}

function onCellMarked(ellCell, i, j) {
    var currCell = gBoard[i][j]

    if (!gGame.isOn) return
    if (currCell.isShown) return
    if (gGame.markedCount >= gLevel.MINES &&
        !currCell.isMarked) return

    //Model:
    if (currCell.isMarked) {
        currCell.isMarked = false
        gGame.markedCount--
        //DOM:
        ellCell.innerText = ''
    } else {
        currCell.isMarked = true
        gGame.markedCount++

        //DOM:
        ellCell.innerText = FLAG
    }

    checkGameOver()
}

function checkGameOver() {
    if (gGame.shownCount + gGame.markedCount === gLevel.SIZE * gLevel.SIZE) {
        gGame.isWinner = true
        gameOver()
    }
}

function gameOver(elCell) {
    gGame.isOn = false

    if (gGame.isWinner) console.log('You win!')
    else {
        renderAllMines()
        console.log('Game over, you lose :(')
    }

}

function renderAllMines() {
    const allMineCells = findObjMines(gBoard)

    allMineCells.forEach(cell => cell.isShown = true)
    renderBoard()
}

function expandShown(location) {
    const mineCount = countMines(gBoard, location.i, location.j)
    if (mineCount > 0) return
    const negLocations = findNegsLocations(gBoard, location)

    for (var i = 0; i < negLocations.length; i++) {
        const currLocation = negLocations[i]

        if (!gBoard[currLocation.i][currLocation.j].isShown
            && !gBoard[currLocation.i][currLocation.j].isMarked) {
            gBoard[currLocation.i][currLocation.j].isShown = true
            gGame.shownCount++
        }
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            const mineCount = countMines(board, i, j)

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
            strHTML += `<td data-i="${i}" data-j="${j}" onclick="onCellClicked(this, ${i}, ${j})"  oncontextmenu="onCellMarked(this, ${i}, ${j})">`

            if (currCell.isMarked) strHTML += FLAG
            else if (currCell.isShown && currCell.isMine) strHTML += MINE
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

function randomizeMines(board, safeCell) {
    var mineCount = gLevel.MINES
    var minesRandomized = 0

    while (minesRandomized < mineCount) {
        var i = getRandomInt(0, board.length);
        var j = getRandomInt(0, board.length);

        if (i !== safeCell.i && j !== safeCell.j) {
            if (!gBoard[i][j].isMine) {
                gBoard[i][j].isMine = true
                minesRandomized++
            }
        }
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
                isMine: false,
                isMarked: false
            }

            //comment later:
            // if (i === 0 && j === 2 || i == 2 && j === 3) {
            //     cell.isMine = true
            //     // cell.isShown = true
            // }

            row.push(cell)
        }
        board.push(row)
    }
    return board
}

function selectBoardSize(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    onInit()
    toggleSizeModal()
}

function toggleSizeModal() {
    const elModal = document.querySelector('.modal.size-selection')
    elModal.classList.toggle('hidden')
}