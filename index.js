const fs = require('fs')
const path = require('path')

//const parse = (filename) => parseSudoku(fs.readFileSync(path.join(__dirname, filename)).toString().split('\r\n'))


const parseSudoku = lines => lines.map(l => l.split("").map(c => c === " " || c === "0" ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [Number(c)]))

//const solutions = []

// const resolve = (filename) => {
//     const start = new Date()
//     const board = parse(filename)

//     printBoard(board)

//     resolveNext(board)

//     console.log(`Solutions:`, solutions.length, ` found in ${new Date() - start}ms`)

//     if (solutions.length > 0) {
//         printBoard(solutions[solutions.length - 1])
//     }
// }

const cloneBoard = (board) => {
    return board.map(l => l.map(c => c));
}

const findNextCell = (board) => {
    let currentCell = [-1,-1]
    let minCandidates = Infinity

    for(var i = 0; i < 9; i++) {
        for(var j = 0; j < 9 ; j++) {
            const candidates = board[i][j]
            const count = candidates.length    
            if(count < minCandidates && count > 1) {
                minCandidates = count 
                currentCell = [i,j]
            }
        }
    }

    return currentCell
}

const resolveNext = (board, solutions) => {

    cleanCandidates(board)
    if (isImpossible(board)) {
        return
    }

    if (isComplete(board)) {
        solutions.push(board)
        return
    }

    const [row, col] = findNextCell(board)
    const candidates = board[row][col]

    if (candidates.length > 1) {
        for (var candidate of candidates) {
            let board2 = cloneBoard(board)
            board2[row][col] = [candidate]

            if (col === 8) {
                resolveNext(board2, solutions, row + 1, 0)
            } else {
                resolveNext(board2, solutions, row, col + 1)
            }
        }
    } else {
        if (col === 8) {
            resolveNext(board, solutions, row + 1, 0)
        } else {
            resolveNext(board, solutions, row, col + 1)
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

    return false
}

const isComplete = (board) => {
    for (var row = 0; row < 9; row++) {
        for (var column = 0; column < 9; column++) {
            if (board[row][column].length > 1) {
                return false
            }
        }
    }

    return true
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

// resolve('examples/0.txt')


main = () => {
    const sudokusLines = fs.readFileSync(path.join(__dirname, 'examples/hard.txt')).toString().split('\r\n')

    const sudokusCount = sudokusLines.length / 10

    for (var sudokuIndex = 0; sudokuIndex < sudokusCount; sudokuIndex++) {
        const start = new Date()
        const sudokuText = sudokusLines.slice(sudokuIndex * 10, sudokuIndex * 10 + 10)

        const [title, ...data] = sudokuText
        const board = parseSudoku(data)


        const solutions = []
        resolveNext(board, solutions)

        console.log(`${title} took ${new Date() - start}ms`)
        // if (solutions.length > 0) {
        //     printBoard(solutions[0])
        // }
    }


}

main()