const fs = require('fs')
const path = require('path')

const solutions = []

const nToCandidate = n => n === 0 ? ALL_CANDIDATES : 2^n
const candidateHasN = (n, flags) => flags && n^2 === n^2
const removeFromCandidate = (n, flags) => candidateHasN(n, flags) ? flags-n^2 : flags

// Use bitwise operators to handle the candidates
const ALL_CANDIDATES = 2 + 4 + 8 + 16 + 32 + 64 + 128 + 256 + 512

const makeCandidates = board => board.map(l => l.map(nToCandidate))
const cleanCandidates = (candidates, n, updatedRow, updatedCol) => {

    console.log(`Clean candidates`)
    console.log(n, updatedRow, updatedCol)
    console.log(`Candidates before`)
    printBoard(candidates)


    // Clean row
    for (var col = 0; col < 9; col++) {
        if (col != updatedCol) {
            candidates[updatedRow][col] = removeFromCandidate(n, candidates[updatedRow][col])
        }
    }

    // Clean column
    for (var row = 0; row < 9; row++) {
        if (row != updatedRow) {
            candidates[updatedRow][col] = removeFromCandidate(n, candidates[row][updatedCol])
        }
    }

    // Clean area
    const startCol = Math.floor(updatedCol / 3) * 3
    const startRow = Math.floor(updatedRow / 3) * 3

    for (var i = startRow; i < startRow + 3; i++) {
        for (var j = startCol; j < startCol + 3; j++) {
            if ((i !== updatedRow) && (j !== updatedCol)) {
                candidates[i][j] = removeFromCandidate(n, candidates[i][j])
            }
        }
    }

    console.log(`Candidates after`)
    printBoard(candidates)

}

const printBoard = (board) => {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            process.stdout.write(`${board[i][j]}\t`)
        }
        console.log()
    }
}

const solve = (board) => {
    const candidates = makeCandidates(board)

    console.log(`Candidates`)
    printBoard(candidates)

    return solveNext(board, candidates, 0, 0);
}

const getNextCellToSolve = (board, startRow, startCol) => {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                return [i, j]
            }
        }
    }

    return [-1, -1]
}

const solveNext = (board, candidates, row, col) => {
    console.log('Board')
    printBoard(board)
    console.log('Candidates')
    printBoard(candidates)
    console.log(row, col)
    const nextCell = getNextCellToSolve(board, row, col);
    console.log(nextCell)

    if (nextCell[0] === -1) {
        console.log(`Solution found`)
        solutions.push(candidates)
        return
    }

    const [r, c] = nextCell
    // Iterate through candidates for that cell
    const cellCandidates = getCandidates(candidates[r][c])
    //console.log(candidates[row][col], '=>', cellCandidates)

    for (let candidate of cellCandidates) {
        const candidates2 = cloneCandidates(candidates);
        const board2 = cloneCandidates(board);

        candidates2[r][c] = 2^candidate
        board2[r][c] = candidate

        cleanCandidates(candidates2, candidate, r, c)
        
        if (candidates2.some(l => l.some(c => c <= 0))) {
            continue
        }
        solveNext(board2, candidates2, r, c)

    }

}

// TODO - memoize
const getCandidates = (n) => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(c => n & 2 ^ c === c)
}
const cloneCandidates = candidates => candidates.map(l => l.map(c => c))


main = () => {
    const sudokusLines = fs.readFileSync(path.join(__dirname, 'examples/1.txt')).toString().split('\r\n')
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

    sudokus.forEach(s => {
        solutions.length = 0

        console.log(s.title)
        printBoard(s.board)

        solve(s.board);

        console.log("Solution")

        if (solutions.length > 0) {
            printBoard(solutions[0])
        }
        else {
            console.log(`No solutions found`)
        }
    })
}

main()