const fs = require('fs');
const assert = require('assert');


//const DIRECTIONS = [[1,1], [1,0], [0,-1], [-1,-1], [-1,-1], [0,0], [0,0]]

function solveOne(data: string): any {
	let xmases = 0
	const world = data.split('\n').map(l => [...l])
	for (let r = 0; r < world.length; r++) {
		for (let c = 0; c < world[r].length; c++) {
			if (world[r][c] !== 'X') continue;

			for (let ro = -1; ro <= 1; ro++) {
				for (let co = -1; co <= 1; co++) {
					if (ro === 0 && co === 0) continue
					let found = true;
					for (const [ci, char] of [...'XMAS'].entries()) {
						const [nr, nc] = [r + ro * ci, c + co * ci]
						if (world[nr]?.[nc] !== char) {
							found = false
							break
						}
					}
					if (found) {
						xmases++
					}
				}
			}
		}
	}
	return xmases
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`..X...
.SAMX.
.A..A.
XMAS.S
.X....`), 4);
	assert.deepStrictEqual(solveOne(`MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`), 18);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	data = data.trim()
	let mases = {}
	const world = data.split('\n').map(l => [...l])
	for (let r = 0; r < world.length; r++) {
		for (let c = 0; c < world[r].length; c++) {
			if (world[r][c] !== 'M') continue;

			for (let ro = -1; ro <= 1; ro++) {
				for (let co = -1; co <= 1; co++) {
					if (ro === 0 && co === 0) continue
					if (ro === 0 || co === 0) continue
					let found = true;
					let middleCoord = null
					for (const [ci, char] of [...'MAS'].entries()) {
						const [nr, nc] = [r + ro * ci, c + co * ci]
						if (ci === 1) {
							middleCoord = [nr, nc]
						}
						if (world[nr]?.[nc] !== char) {
							found = false
							break
						}
					}
					if (found && middleCoord) {
						mases[middleCoord.join('|')] = (mases[middleCoord.join('|')] ?? 0) + 1
					}
				}
			}
		}
	}
	return Object.values(mases).filter(count => count >= 2).length
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`M.S
.A.
M.S`), 1);
	assert.deepStrictEqual(solveTwo(`.S.
SAM
.M.`), 0);
	assert.deepStrictEqual(solveTwo(`MS.
SAM
.MS`), 0);
	assert.deepStrictEqual(solveTwo(`MSS
SAM
MMS`), 1);
	assert.deepStrictEqual(solveTwo(`.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........`), 9);
	console.log(solveTwo(data));
})();
