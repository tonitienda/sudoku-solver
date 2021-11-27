const fs = require('fs')
const path = require('path')

const parse = (filename) => fs.readFileSync(path.join(__dirname, filename)).toString().split('\r\n').map(l => l.split("").map(c => c === " " ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [Number(c)]))

const solutions = []

const resolve = (filename) => {
    const board = parse(filename)

    printBoard(board)

    resolveNext(board)

    console.log(`Solutions:`, solutions.length)
}

const cloneBoard = (board) => {
    return board.map(l => l.map(c => c));
}

const resolveNext = (board, row = 0, col = 0) => {

    cleanCandidates(board)
    if (isImpossible(board)) {
        return
    }

    if (row === 9) {
        solutions.push(board)
        
        console.log(`Solution found!(${solutions.length})`)
        printBoard(board)
        return
    }

    const candidates = board[row][col]
    
    if (candidates.length > 1) {
        for (var candidate of candidates) {
            let board2 = cloneBoard(board)
            board2[row][col] = [candidate]

            if (col === 8) {
                resolveNext(board2, row + 1, 0)
            } else {
                resolveNext(board2, row, col + 1)
            }
        }
    } else {
        if (col === 8) {
            resolveNext(board, row + 1, 0)
        } else {
            resolveNext(board, row, col + 1)
        }
    }



}

const isImpossible = (board) => {
    for (var row = 0; row < 9; row++) {
        for (var column = 0; column < 9; column++) {
            if (board[row][column].length === 0) {
                return true
            }
        }
    }
}

const cleanCandidates = (board) => {
    for (var row = 0; row < 9; row++) {
        for (var column = 0; column < 9; column++) {
            if (board[row][column].length === 1) {
                cleanRow(row, column, board)
                cleanColumn(row, column, board)
                cleanArea(row, column, board)
            }
        }
    }
}

const cleanRow = (row, column, board) => {
    for (var i = 0; i < 9; i++) {
        if (i != column) {
            board[row][i] = board[row][i].filter(n => n != board[row][column])
        }
    }
}

const cleanColumn = (row, column, board) => {
    for (var i = 0; i < 9; i++) {
        if (i != row) {
            board[i][column] = board[i][column].filter(n => n != board[row][column])
        }
    }
}

const cleanArea = (row, column, board) => {
    const startCol = Math.floor(column / 3) * 3
    const startRow = Math.floor(row / 3) * 3

    for (var i = startRow; i < startRow + 3; i++) {
        for (var j = startCol; j < startCol + 3; j++) {
            if ((i !== row) && (j !== column)) {
                board[i][j] = board[i][j].filter(n => n != board[row][column])
            }
        }
    }
}


const printBoard = (board) => {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            process.stdout.write(board[i][j].join("").padEnd(10, " "))
        }
        console.log()
    }
}

resolve('examples/1.txt')
