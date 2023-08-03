'use strict'

var MINE = '💣'
var FLAG = '📍'

var gBoard
var gHintCount
var gTimerIntervalId

var gGame = {
    isOn: false,
    isWinner: false,
    isHintMode: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isFirstClick: true,
    lives: 3
}

var gLevel = {
    SIZE: 4,
    MINES: 2,
    DIFFICULTY: 'easy',
}

function onInit() {
    gGame.isOn = true
    gGame.isWinner = false
    gGame.isHintMode = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.isFirstClick = true
    gGame.lives = 3
    gHintCount = 3
    gBoard = buildBoard()
    renderBoard()
    resetTimer()
    renderLives()
    renderSmileyBtn()
    resetHintBtns()
    renderFlagsLeft()
    // hideGameOverModal()
}

function onCellClicked(elCell, i, j) {

    if (gGame.isFirstClick) {
        randomizeMines(gBoard, { i, j })
        setMinesNegsCount(gBoard)
        renderBoard()
        startTimer()
        gGame.isFirstClick = false
    }
    const currCell = gBoard[i][j]
    if (!gGame.isOn) return
    if (currCell.isMarked) return
    if (currCell.isShown) return
    if (gGame.isHintMode) {
        flashHintCells(elCell, i, j)
        return
    }
    if (!currCell.isShown) {
        currCell.isShown = true
        gGame.shownCount++
    }


    if (currCell.isMine) {
        mineClicked()
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

    renderFlagsLeft()
    checkGameOver()
}

function renderScoreboardModal() {
    const elModal = document.querySelector('.modal.scoreboard')
    elModal.classList.remove('hidden')
    setTimeout(hideScoreboardModal, 3000)
}

function hideScoreboardModal() {
    const elModal = document.querySelector('.modal.scoreboard')
    elModal.classList.add('hidden')
}

function checkBestScores() {
    // console.log(gLevel.DIFFICULTY)
    // localStorage.clear();
    var currDifficulty = localStorage.getItem(`${gLevel.DIFFICULTY}`);

    if (currDifficulty === null) {
        localStorage.setItem(`${gLevel.DIFFICULTY}`, `${Infinity}`)
    } else {
        if (gGame.secsPassed > 0 && gGame.secsPassed < currDifficulty) {
            localStorage.setItem(`${gLevel.DIFFICULTY}`, `${gGame.secsPassed}`)
            return
        }
        localStorage.getItem(`${gLevel.DIFFICULTY}`);
    }
    return currDifficulty
}

function renderTimer() {
    const elTimer = document.querySelector('span.timer')
    elTimer.innerText = gGame.secsPassed
}

function renderFlagsLeft() {
    const elSpan = document.querySelector('span.marked-count')
    elSpan.innerText = gLevel.MINES - gGame.markedCount
}

function enableHintMode(elBtn) {
    if (elBtn.classList.contains('selected')) return
    renderHintBtn(elBtn)

    gGame.isHintMode = true
    gHintCount--
}

function renderHintBtn(elBtn) {
    if (gGame.isHintMode) return

    var strHTML = '<img src="img/light-off.png" alt="light-bulb-off">'
    elBtn.innerHTML = strHTML
    elBtn.classList.add('selected')
}

function resetHintBtns() {
    var strHTML = ''
    const elBtns = document.querySelectorAll('button.light')

    strHTML += '<img src="img/light-on.png" alt="light-bulb-on"></img>'

    elBtns.forEach(
        btn => {
            btn.innerHTML = strHTML
            btn.classList.remove('selected')
        }
    )
}

function flashHintCells(elCell, i, j) {
    if (!gGame.isHintMode) return
    //Model:
    const allNegsLocations = findNegsLocations(gBoard, { i, j })
    allNegsLocations.push({ i, j }) //Add clicked location

    //DOM Flash Cells for a second:
    allNegsLocations.forEach(n => gBoard[n.i][n.j].isFlashed = true)
    renderBoard()

    //DOM Hide them after a second:
    setTimeout(
        () => {
            allNegsLocations.forEach(n => gBoard[n.i][n.j].isFlashed = false)
            renderBoard()
        },
        1000
    )

    gGame.isHintMode = false
}

function mineClicked() {
    //Model:
    gGame.lives--
    if (gGame.lives === 0) gameOver()

    //DOM:
    renderLives()
}

function renderGameOverModal() {
    const elModal = document.querySelector('.modal.game-over')
    const elPVictory = document.querySelector('p.victory-state')
    var strHTML = ''
    if (gGame.isWinner) {
        strHTML += `Victorious, It took you ${gGame.secsPassed}s 🎉`
    } else {
        strHTML += 'You lose, Better luck next time!'
    }

    elPVictory.innerText = strHTML

    elModal.classList.remove('hidden')
    setTimeout(hideGameOverModal, 3500)
}

function hideGameOverModal() {
    const elModal = document.querySelector('.modal.game-over')
    elModal.classList.add('hidden')
}

function renderSmileyBtn() {
    const elBtn = document.querySelector('button.smiley')
    if (!gGame.isOn && gGame.isWinner) elBtn.innerText = '😎'
    else if (!gGame.isOn && !gGame.isWinner) elBtn.innerText = '🤯'
    else elBtn.innerText = '😃'
}

function renderLives() {
    // console.log(gGame.lives, 'Lives left')
    const elLiveContainer = document.querySelector('.lives-container p')
    var strInnerText = ''

    for (var i = 0; i < gGame.lives; i++) {
        strInnerText += '💖 '
    }

    if (gGame.lives === 0) strInnerText = '💀'

    elLiveContainer.innerText = strInnerText
}

function checkGameOver() {
    if (gGame.shownCount + gGame.markedCount === gLevel.SIZE * gLevel.SIZE) {
        gGame.isWinner = true
        gameOver()
    }
}

function gameOver(elCell) {
    gGame.isOn = false
    resetTimer()
    renderSmileyBtn()

    if (gGame.isWinner) console.log('You win!')
    else {
        renderAllMines()
        console.log('Game over, you lose :(')
    }

    renderGameOverModal()

}

function storeBestTime() {

}

function renderAllMines() {
    const allMineCells = findMinesInBoard(gBoard)

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
            else if (currCell.isFlashed && currCell.isMine) strHTML += MINE
            else if (currCell.isFlashed) strHTML += currCell.minesAroundCount
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
        if (currCellModel.isMine && currCellModel.isFlashed) currTd.classList.add('boom')
        else if (currCellModel.isMine && currCellModel.isShown) currTd.classList.add('boom')
        else if (currCellModel.isShown || currCellModel.isFlashed) currTd.classList.add('shown')
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
                isFlashed: false,
                isMine: false,
                isMarked: false
            }

            row.push(cell)
        }
        board.push(row)
    }
    return board
}

function selectBoardSize(size, mines, difficulty) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    gLevel.DIFFICULTY = difficulty
    onInit()
    toggleSizeModal()
}

function toggleSizeModal() {
    const elModal = document.querySelector('.modal.size-selection')
    elModal.classList.toggle('hidden')
}