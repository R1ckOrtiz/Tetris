const grid = document.querySelector('#tetris');
const scoreDisplay = document.querySelector('#score');
const width = 10;
let squares = [];
let currentPosition = 4;
let currentRotation = 0;
let score = 0;
let timerId;

// Tetriminos
const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
];

const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
];

const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
];

const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
];

const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
];

const tetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

let random = Math.floor(Math.random() * tetrominos.length);
let current = tetrominos[random][currentRotation];

// Cria o campo de jogo
function createBoard() {
    for (let i = 0; i < 200; i++) {
        const square = document.createElement('div');
        square.classList.add('cell');
        grid.appendChild(square);
        squares.push(square);
    }
    for (let i = 0; i < 10; i++) {
        const square = document.createElement('div');
        square.classList.add('taken');
        grid.appendChild(square);
        squares.push(square);
    }
}

createBoard();

// Desenha o Tetrimino
function draw() {
    current.forEach(index => squares[currentPosition + index].classList.add('tetromino'));
}

// Apaga o Tetrimino
function undraw() {
    current.forEach(index => squares[currentPosition + index].classList.remove('tetromino'));
}

// Movimenta o Tetrimino para baixo
function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

// Congela o Tetrimino quando ele chega ao final
function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        random = Math.floor(Math.random() * tetrominos.length);
        current = tetrominos[random][currentRotation];
        currentPosition = 4;
        draw();
        addScore();
        gameOver();
    }
}

// Movimenta o Tetrimino para a esquerda
function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1;
    }
    draw();
}

// Movimenta o Tetrimino para a direita
function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if (!isAtRightEdge) currentPosition += 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1;
    }
    draw();
}

// Rotaciona o Tetrimino
function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) currentRotation = 0;
    current = tetrominos[random][currentRotation];
    draw();
}

// Controla o Tetrimino
function control(e) {
    if (e.keyCode === 37) {
        moveLeft();
    } else if (e.keyCode === 38) {
        rotate();
    } else if (e.keyCode === 39) {
        moveRight();
    } else if (e.keyCode === 40) {
        moveDown();
    }
}

document.addEventListener('keyup', control);

// Adiciona pontuação
function addScore() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
            });
            const removedSquares = squares.splice(i, width);
            squares = removedSquares.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}

// Verifica fim de jogo
function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'Game Over';
        clearInterval(timerId);
    }
}

// Inicia o jogo
timerId = setInterval(moveDown, 1000);
