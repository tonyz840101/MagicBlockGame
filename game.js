
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const scale = 2
const widthGrid = 11 * scale
const heightGrid = 7 * scale
const adjustX = 4
const adjustY = 1
const boardWidth = 5
var edge = scaledUnit * boardWidth

const colorSetting = {
    boardLine: 'rgba(77, 77, 77, 1)',
    colors: [
        '#EA0000',//orange
        '#FF8000',//red
        '#FFFF37',//yellow
        '#FFFFFF',//white
        '#00DB00',//green
        '#0080FF'//blue
    ]
}

var scaledUnit
var unit

function resizeCanvas() {
    // 11 * 7
    unit = Math.min(~~(window.innerWidth / widthGrid), ~~(window.innerHeight / heightGrid))
    canvas.width = unit * widthGrid
    canvas.height = unit * heightGrid
    scaledUnit = unit * scale

    edge = scaledUnit * boardWidth
    render()
}

window.addEventListener('resize', resizeCanvas)

var board = []
var answer = []
var hole
var win
var moves
var repeater
var started
var timestamp

function initBoard(blocks, ans) {
    answer = ans
    win = false
    hole = { x: 2, y: 2 }
    moves = 0
    repeater = 1
    started = false

    for (let x = 0; x < boardWidth; x++) {
        board[x] = []
        for (let y = 0; y < boardWidth; y++) {
            if (x === 2 && y === 2) {
                board[x][y] = -1
            } else {
                board[x][y] = blocks.pop()
            }
        }
    }
}


document.addEventListener("keyup", (e) => {
    const key = e.code
    // console.log(key)
    if (keyHandler[key]) {
        keyHandler[key](true)
    }
}, false);

document.addEventListener("keydown", (e) => {
    const key = e.code
    // console.log(key)
    if (keyHandler[key]) {
        keyHandler[key](false)
    }
}, false);

const keyHandler =
    (() => {
        while (1) {
            // let setting = prompt('control style?\n==> 1 move blank\n==> 2 fill blank\n==> 3 multi move with 1\n==> 4 multi move with 2')
            let setting = prompt('control style?\n==> 1 move blank\n==> 2 fill blank\n')
            switch (setting) {
                // case '1':
                //     return ({
                //         Space: (v) => startGame(v),
                //         KeyW: (v) => moveUp(v), //W
                //         KeyS: (v) => moveDown(v), //S
                //         KeyA: (v) => moveLeft(v), //A
                //         KeyD: (v) => moveRight(v), //D
                //         ArrowUp: (v) => moveUp(v), //A_UP
                //         ArrowDown: (v) => moveDown(v), //A_DOWN
                //         ArrowLeft: (v) => moveLeft(v), //A_LEFT
                //         ArrowRight: (v) => moveRight(v), //A_RIGHT
                //     })
                // case '2':
                //     return ({
                //         Space: (v) => startGame(v),
                //         KeyW: (v) => moveDown(v), //W
                //         KeyS: (v) => moveUp(v), //S
                //         KeyA: (v) => moveRight(v), //A
                //         KeyD: (v) => moveLeft(v), //D
                //         ArrowUp: (v) => moveDown(v), //A_UP
                //         ArrowDown: (v) => moveUp(v), //A_DOWN
                //         ArrowLeft: (v) => moveRight(v), //A_LEFT
                //         ArrowRight: (v) => moveLeft(v), //A_RIGHT
                //     })
                case '1':
                    return ({
                        Space: (v) => startGame(v),
                        KeyW: (v) => repeatMove(moveUp, v), //W
                        KeyS: (v) => repeatMove(moveDown, v), //S
                        KeyA: (v) => repeatMove(moveLeft, v), //A
                        KeyD: (v) => repeatMove(moveRight, v), //D
                        ArrowUp: (v) => repeatMove(moveUp, v), //A_UP
                        ArrowDown: (v) => repeatMove(moveDown, v), //A_DOWN
                        ArrowLeft: (v) => repeatMove(moveLeft, v), //A_LEFT
                        ArrowRight: (v) => repeatMove(moveRight, v), //A_RIGHT
                        1: () => { repeater = 1 },
                        2: () => { repeater = 2 },
                        3: () => { repeater = 3 },
                        4: () => { repeater = 4 },
                    })
                case '2':
                    return ({
                        Space: (v) => startGame(v),
                        KeyW: (v) => repeatMove(moveDown, v), //W
                        KeyS: (v) => repeatMove(moveUp, v), //S
                        KeyA: (v) => repeatMove(moveRight, v), //A
                        KeyD: (v) => repeatMove(moveLeft, v), //D
                        ArrowUp: (v) => repeatMove(moveDown, v), //A_UP
                        ArrowDown: (v) => repeatMove(moveUp, v), //A_DOWN
                        ArrowLeft: (v) => repeatMove(moveRight, v), //A_LEFT
                        ArrowRight: (v) => repeatMove(moveLeft, v), //A_RIGHT
                        1: () => { repeater = 1 },
                        2: () => { repeater = 2 },
                        3: () => { repeater = 3 },
                        4: () => { repeater = 4 },
                    })
            }
        }
    })()

function startGame(up) {
    if (!up || started) return
    started = true
    timestamp = Date.now()
    console.log('start')
    render()
}

function repeatMove(move, v) {
    for (let i = 0; i < repeater; i++) {
        move(v)
    }
    repeater = 1
}

function moveUp(up) {
    // console.log('moveUp', hole)
    if (up || !started || win || hole.y === 0) return
    let currY = hole.y
    let currX = hole.x
    hole.y--
    let tmp = board[hole.x][hole.y]
    board[hole.x][hole.y] = board[currX][currY]
    board[currX][currY] = tmp
    afterMove()
}

function moveDown(up) {
    // console.log('moveDown', hole)
    if (up || !started || win || hole.y === 4) return
    let currY = hole.y
    let currX = hole.x
    hole.y++
    let tmp = board[hole.x][hole.y]
    board[hole.x][hole.y] = board[currX][currY]
    board[currX][currY] = tmp
    afterMove()
}

function moveLeft(up) {
    // console.log('moveLeft', hole)
    if (up || !started || win || hole.x === 0) return
    let currY = hole.y
    let currX = hole.x
    hole.x--
    let tmp = board[hole.x][hole.y]
    board[hole.x][hole.y] = board[currX][currY]
    board[currX][currY] = tmp
    afterMove()
}

function moveRight(up) {
    // console.log('moveRight', hole)
    if (up || !started || win || hole.x === 4) return
    let currY = hole.y
    let currX = hole.x
    hole.x++
    let tmp = board[hole.x][hole.y]
    board[hole.x][hole.y] = board[currX][currY]
    board[currX][currY] = tmp
    afterMove()
}

function afterMove() {
    moves++
    if (moves > 0 && moves % 10 === 0) {
        console.log(`${moves} steps used`)
    }
    checkAnswer()
    render()
}


function shuffle(ob) {
    for (var i = ob.length; i > 0; i--) {
        var j = Math.floor(Math.random() * i);
        var tmp = ob[i - 1];
        ob[i - 1] = ob[j];
        ob[j] = tmp;
    }
}

function createAnswer() {
    let a = []
    let b = []
    for (let i = 0; i < 6; i++) {
        a[i] = 4
    }
    for (let i = 0; i < 9; i++) {
        while (1) {
            let tmp = ~~(Math.random() * 6)
            if (a[tmp] > 0) {
                // console.log(tmp, a[tmp])
                b.push(tmp)
                a[tmp]--
                break
            }
        }
    }
    return b
}

function createNewCudes() {
    let a = []
    for (let i = 0; i < 24; i++) {
        a[i] = i
    }
    shuffle(a)
    return a
}

function drawGrid() {
    ctx.strokeStyle = colorSetting.boardLine;
    ctx.lineWidth = 2
    for (let c = 0; c < boardWidth + 1; c++) {
        ctx.beginPath()

        {
            let xStart = (adjustX + c) * scaledUnit
            let yStart = adjustY * scaledUnit
            ctx.moveTo(xStart, yStart)
            ctx.lineTo(xStart, yStart + edge)
        }

        {
            let xStart = adjustX * scaledUnit
            let yStart = (adjustY + c) * scaledUnit
            ctx.moveTo(xStart, yStart)
            ctx.lineTo(xStart + edge, yStart)
        }

        ctx.stroke()
        ctx.closePath()
    }
}

function drawBlock() {
    for (let y = 0; y < boardWidth; y++) {
        for (let x = 0; x < boardWidth; x++) {
            let color = board[x][y]
            if (color === -1) {
                continue
            }
            ctx.beginPath()
            ctx.fillStyle = colorSetting.colors[color % 6]
            ctx.rect((x + adjustX) * scaledUnit + 1, (y + adjustY) * scaledUnit + 1, scaledUnit - 2, scaledUnit - 2)
            ctx.fill()
            ctx.closePath()
        }
    }
}

function drawAnswer() {
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            let color = answer[x + y * 3]
            if (color === -1) {
                continue
            }
            ctx.beginPath()
            ctx.fillStyle = colorSetting.colors[color]
            ctx.rect(x * unit + scaledUnit + 1, y * unit + scaledUnit + 1, unit - 2, unit - 2)
            ctx.fill()
            ctx.closePath()
        }
    }
}

function checkAnswer() {
    let checkWin = true
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            if (answer[x + y * 3] !== board[x + 1][y + 1] % 6) {

                // console.log(x, y, " !== ", x + 1, y + 1)
                // console.log(answer[x + y * 3], board[x + 1][y + 1] % 6)
                checkWin = false

            }
        }
    }
    if (checkWin) {
        console.log('| Finished!')
        console.log(`| ${((Date.now() - timestamp) / 1000).toFixed(2)} second(s)`)
        console.log(`| total ${moves} steps used`)
    }
    win = checkWin
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawGrid()
    drawAnswer()
    if (!started) return
    drawBlock()
}


initBoard(createNewCudes(), createAnswer())
resizeCanvas()
console.log('release Space key to start')