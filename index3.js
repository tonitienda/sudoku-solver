const fs = require('fs')
const path = require('path')

const printBoard = (board) => {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            process.stdout.write(`${board[i][j]}\t`)
        }
        console.log()
    }
}

const now = () => new Date()

let times = {}
const withAccumulatedTimes = (name, fn) => {
    const start = now()
    const result = fn()

    if (!times[name]) {
        times[name] = { times: 0, ms: 0 }
    }

    // Nano to ms
    times[name].ms += (now() - start)
    times[name].times++

    return result

}

const resetAccumulatedTimes = () => times = {}

const isInRow = (board, row, col, n) => board[row].some((x, idx) => x === n)
const isInCol = (board, row, col, n) => board.some((row2, idx) => row2[col] === n)

const isInArea = (board, row, col, n) => {
    // Clean area
    const startCol = Math.floor(col / 3) * 3
    const startRow = Math.floor(row / 3) * 3

    for (var i = startRow; i < startRow + 3; i++) {
        for (var j = startCol; j < startCol + 3; j++) {
            if (board[i][j] === n) {
                return true
            }
        }
    }

    return false
}

const getNextCell = (board) => {
    // Clean row
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                return [row, col]
            }
        }
    }

    return null
}

const getCandidates = (board, [row, col]) => [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => 
    !withAccumulatedTimes("isInRow", () => isInRow(board, row,col, n)) && 
    !withAccumulatedTimes("isInCol", () => isInCol(board, row, col, n)) && 
    !withAccumulatedTimes("isInArea",() => isInArea(board, row, col, n)))    

function solve(board) {
    const nextCell = getNextCell(board)

    if (!nextCell) {
        return board
    }

    // console.log(nextCell)
    const candidates = withAccumulatedTimes("getCandidates", () => getCandidates(board, nextCell))

    // No more options mean that the current board configuration is not
    // solvable
    if (candidates.length === 0) {
        return null
    }
    // console.log(`Candidates:`, nextCell, candidates)
    const [row, col] = nextCell
    for (let candidate of candidates) {
        board[row][col] = candidate
        const solution = solve(board)

        if (solution) {
            return solution
        } else {
            board[row][col] = 0
        }
    }
}

main = () => {
    const sudokusLines = fs.readFileSync(path.join(__dirname, 'examples/41.txt')).toString().split('\r\n')
    const sudokusCount = sudokusLines.length / 10

    const sudokus = []
    for (var sudokuIndex = 0; sudokuIndex < sudokusCount; sudokuIndex++) {
        const sudokuText = sudokusLines.slice(sudokuIndex * 10, sudokuIndex * 10 + 10)

        const [title, ...board] = sudokuText

        sudokus.push({
            title,
            board: board.map(l => l.split("").map(c => Number(c)))
        })
    }

    sudokus.forEach(sudoku => {
        resetAccumulatedTimes()
        const start = new Date()
        // printBoard(sudoku.board)
        const solution = solve(sudoku.board)


        console.log(`${sudoku.title} took ${new Date() - start}ms`)
        console.log(times)

         console.log(`Solution:`)
         printBoard(solution)
    })
}

main()

//  console.log(removeFromCandidate(4, 2))
//  console.log(candidateHasN (4, 2))
//  console.log((2 & Math.pow(2,4)))

 // console.log( (flags && Math.pow(2,n)) === Math.pow(2,n))