const fs = require('fs');
const path = require('path')

const getSudokuLines = (localpath) => fs.readFileSync(path.join(__dirname, localpath)).toString().replace(/\./g, "0").split('\n')


function main() {
    fs.writeFileSync("examples/hard2.txt", getSudokuLines("examples/hard.txt").map((s,idx) => [`Grid ${idx+1}`, ...s.match(/.{9}/g)].join("\r\n")).join("\r\n"))
}

main()