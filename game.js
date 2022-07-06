
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

function initBoard(blocks, ans) {
    answer = ans
    win = false
    hole = { x: 2, y: 2 }
    moves = 0
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


document.addEventListener("keydown", (e) => {
    const key = e.key
    if (keyHandler[key]) {
        keyHandler[key](false)
    }
}, false);

const keyHandler = {
    w: (v) => moveUp(v), //W
    s: (v) => moveDown(v), //S
    a: (v) => moveLeft(v), //A
    d: (v) => moveRight(v), //D
    ArrowUp: (v) => moveUp(v), //A_UP
    ArrowDown: (v) => moveDown(v), //A_DOWN
    ArrowLeft: (v) => moveLeft(v), //A_LEFT
    ArrowRight: (v) => moveRight(v), //A_RIGHT
}


function moveUp() {
    // console.log('moveUp', hole)
    if (hole.y === 0 || win) return
    let currY = hole.y
    let currX = hole.x
    hole.y--
    let tmp = board[hole.x][hole.y]
    board[hole.x][hole.y] = board[currX][currY]
    board[currX][currY] = tmp
    afterMove()
}

function moveDown() {
    // console.log('moveDown', hole)
    if (hole.y === 4 || win) return
    let currY = hole.y
    let currX = hole.x
    hole.y++
    let tmp = board[hole.x][hole.y]
    board[hole.x][hole.y] = board[currX][currY]
    board[currX][currY] = tmp
    afterMove()
}

function moveLeft() {
    // console.log('moveLeft', hole)
    if (hole.x === 0 || win) return
    let currY = hole.y
    let currX = hole.x
    hole.x--
    let tmp = board[hole.x][hole.y]
    board[hole.x][hole.y] = board[currX][currY]
    board[currX][currY] = tmp
    afterMove()
}

function moveRight() {
    // console.log('moveRight', hole)
    if (hole.x === 4 || win) return
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
    console.log('step:', moves)
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
    if (checkWin) console.log('win!! congrat.')
    win = checkWin
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawGrid()
    drawBlock()
    drawAnswer()
}


initBoard(createNewCudes(), createAnswer())
resizeCanvas()