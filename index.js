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

const resolveNext = (board, solutions, row = 0, col = 0) => {

    const [stillViable, board2] = cleanCandidates(board)

    //console.log([row, col], stillViable)
    if (!stillViable) {
        return
    }

    if (row === 9) {
        solutions.push(board2)

        //console.log(`Solution found!(${solutions.length})`)
        return
    }

    const candidates = board2[row][col]

    if (candidates.length > 1) {
        for (var candidate of candidates) {
            board2[row][col] = [candidate]

            if (col === 8) {
                resolveNext(board2, solutions, row + 1, 0)
            } else {
                resolveNext(board2, solutions, row, col + 1)
            }
        }
    } else {
        if (col === 8) {
            resolveNext(board2, solutions, row + 1, 0)
        } else {
            resolveNext(board2, solutions, row, col + 1)
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

const allCandidates = [1,2,3,4,5,6,7,8,9]




const cleanCandidates = (board) => {
    // const board2 = cloneBoard(board)

    const board2 = []
    
    for (var row = 0; row < 9; row++) {
        for (var column = 0; column < 9; column++) {
            const forbiddenNumbersRow = board[row].filter(r => r.length === 1).flatMap(n => n)
            const forbiddenNumbersRow = board[row].filter(r => r.length === 1).flatMap(n => n)
            const candidates = board[row][column]
            

            if (candidates.length === 1) {
                if(!(cleanRow(row, column, board2) &&
                cleanColumn(row, column, board2) &&
                cleanArea(row, column, board2))) {
                    return [false, []]
                }
            }
        }
    }

    return [true, board2]
}

const cleanRow = (row, column, board) => {
    for (var i = 0; i < 9; i++) {
        if (i != column) {
            board[row][i] = board[row][i].filter(n => n != board[row][column])
            if(board[row][i].length === 0) {
                return false
            }
        }
    }

    return true
}

const cleanColumn = (row, column, board) => {
    for (var i = 0; i < 9; i++) {
        if (i != row) {
            board[i][column] = board[i][column].filter(n => n != board[row][column])
            if(board[i][column].length === 0) {
                return false
            }
        }
    }

    return true
}

const cleanArea = (row, column, board) => {
    const startCol = Math.floor(column / 3) * 3
    const startRow = Math.floor(row / 3) * 3

    for (var i = startRow; i < startRow + 3; i++) {
        for (var j = startCol; j < startCol + 3; j++) {
            if ((i !== row) && (j !== column)) {
                board[i][j] = board[i][j].filter(n => n != board[row][column])
                if(board[i][j].length === 0) {
                    return false
                }
            }
        }
    }

    return true
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
    // const sudokusLines = fs.readFileSync(path.join(__dirname, 'examples/hard.txt')).toString().split('\r\n')
   const sudokusLines = fs.readFileSync(path.join(__dirname, 'examples/easy.txt')).toString().split('\r\n')

    const sudokusCount = sudokusLines.length / 10

    for (var sudokuIndex = 0; sudokuIndex < sudokusCount; sudokuIndex++) {
        const start = new Date()
        const sudokuText = sudokusLines.slice(sudokuIndex * 10, sudokuIndex * 10 + 10)

        const [title, ...data] = sudokuText
        const board = parseSudoku(data)
        process.stdout.write(`${title} ...`)

        const solutions = []
        resolveNext(board, solutions)

        console.log(`${title} took ${new Date() - start}ms`)
        if (solutions.length > 0) {
            //printBoard(solutions[0])
        }
    }


}

main()