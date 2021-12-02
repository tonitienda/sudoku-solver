const fs = require('fs')
const path = require('path')

const solutions = []

// Use bitwise operators to handle the candidates
const ALL_CANDIDATES = 2 + 4 + 8 + 16 + 32 + 64 + 128 + 256 + 512

const nToCandidate = n => n === 0 ? ALL_CANDIDATES : Math.pow(2,n)

// TODO - memoize
const getCandidatesCache = {}
const getCandidates = (n) => {
    if(!getCandidatesCache[n]) {
        getCandidatesCache[n] = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(c => candidateHasN(c, n))
    }
    return getCandidatesCache[n]
}

const candidateHasN = (n, flags) => (flags & Math.pow(2,n)) === Math.pow(2,n)
const removeFromCandidate = (n, flags) => candidateHasN(n, flags) ? flags - Math.pow(2,n) : flags


const makeCandidates = board => board.map(l => l.map(nToCandidate))
const fromCandidateToBoard = candidates => candidates.map(c => c.map(c => Math.round(Math.log(c)/Math.log(2))))

let cleanCandidatesTime = 0
const cleanCandidates = (candidates, n, updatedRow, updatedCol) => {
    const start = new Date()
    // console.log(`Clean candidates`)
    //console.log(n, updatedRow, updatedCol)
    // console.log(`Candidates before`)
    // printBoard(candidates)


    // Clean row
    for (var col = 0; col < 9; col++) {
        if (col != updatedCol) {
            candidates[updatedRow][col] = removeFromCandidate(n, candidates[updatedRow][col])

                if(candidates[updatedRow][col] === 0) {
                    return false
                }
        }
    }

    // Clean column
    for (var row = 0; row < 9; row++) {
        if (row != updatedRow) {
            candidates[row][updatedCol] = removeFromCandidate(n, candidates[row][updatedCol])

            if(candidates[row][updatedCol] === 0) {
                return false
            }
        }
    }

    // Clean area
    const startCol = Math.floor(updatedCol / 3) * 3
    const startRow = Math.floor(updatedRow / 3) * 3

    for (var i = startRow; i < startRow + 3; i++) {
        for (var j = startCol; j < startCol + 3; j++) {
            if ((i !== updatedRow) && (j !== updatedCol)) {
                candidates[i][j] = removeFromCandidate(n, candidates[i][j])

                if(candidates[i][j] === 0) {
                    return false
                }
            }
        }
    }

   // console.log(`Candidates after`)
   // printBoard(candidates)

   cleanCandidatesTime+= new Date() - start

   return true

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

    // console.log(`Candidates`)
   //  printBoard(candidates)

    solveNext(board, candidates, 0, 0);
}
let getNextCellToSolveTime = 0
const getNextCellToSolve = (board, startRow, startCol) => {
    const start = new Date()

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                getNextCellToSolveTime += new Date() - start
                return [i, j]
            }
        }
    }

    getNextCellToSolveTime += new Date() - start
    return [-1, -1]
}

const solveNext = (board, candidates, row, col) => {
   // console.log('Board')
   // printBoard(board)
  //  console.log('Candidates')
  //  printBoard(candidates)
  //  console.log(row, col)
   
    const nextCell = getNextCellToSolve(board, row, col);
    //console.log(nextCell)

    if (nextCell[0] === -1) {
        //console.log(`Solution found`)
        solutions.push(fromCandidateToBoard(candidates))
        return
    }

    const [r, c] = nextCell
    // Iterate through candidates for that cell
    const cellCandidates = getCandidates(candidates[r][c])
   // console.log(candidates[r][c], '=>', cellCandidates)

   for(let i = 0; i< cellCandidates.length; i++) {
       const candidate = cellCandidates[i]
        const candidates2 = cloneCandidates(candidates);
        const board2 = cloneCandidates(board);

        candidates2[r][c] = Math.pow(2, candidate)
        board2[r][c] = candidate

        const isValid = cleanCandidates(candidates2, candidate, r, c)

        if (!isValid) {
            // If the last candidate does not work, we restore the board
            // if(i === cellCandidates.length-1) {
            //     board[r][c] = 0
            // }
            continue
        }

        solveNext(board2, candidates2, r, c)
    }


}

let cloneCandidatesTime = 0
const cloneCandidates = candidates => {

    const start = new Date()
    const candidates2 = candidates.map(l => l.map(c => c))
    cloneCandidatesTime += new Date() - start
    return candidates2
}

main = () => {
    const sudokusLines = fs.readFileSync(path.join(__dirname, 'examples/easy.txt')).toString().split('\r\n')
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
        const start = new Date()
      
        solutions.length = 0
        getNextCellToSolveTime=0
        cleanCandidatesTime=0
        cloneCandidatesTime = 0
        //console.log(s.title)
       // printBoard(s.board)

        solve(s.board);
        console.log(`${s.title} took ${new Date() - start}ms (getNextCellToSolveTime: ${getNextCellToSolveTime}, cleanCandidatesTime: ${cleanCandidatesTime}, cloneCandidatesTime: ${cloneCandidatesTime})`)

        // console.log("Solution")

        // if (solutions.length > 0) {
        //     printBoard(solutions[0])
        // }
        // else {
        //     console.log(`No solutions found`)
        // }
    })
}

  main()

//  console.log(removeFromCandidate(4, 2))
//  console.log(candidateHasN (4, 2))
//  console.log((2 & Math.pow(2,4)))
 
 // console.log( (flags && Math.pow(2,n)) === Math.pow(2,n))