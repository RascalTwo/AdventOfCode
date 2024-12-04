const fs = require('fs');
const assert = require('assert');

const CARDINAL_DIRECTION = [[-1, 0], [0, -1], [0, 1], [1, 0]] as [number, number][];
const DIAGONAL_DIRECTIONS = [[-1, -1], [1, 1], [1, -1], [-1, 1]] as [number, number][]

const ALL_DIRECTIONS = [
	...CARDINAL_DIRECTION,
	...DIAGONAL_DIRECTIONS
]

const wordExistsAt = (world: string[], word: string, r: number, c: number, ro: number, co: number) => [...word.slice(1)].every((char, i) => {
	const [nr, nc] = [
		r + (ro * (i + 1)),
		c + (co * (i + 1))
	]
	return world[nr]?.[nc] === char
})


function* findWords(data: string, word: string, directions: [number, number][]) {
	const world = data.split('\n')
	for (let r = 0; r < world.length; r++) {
		for (let c = 0; c < world[r].length; c++) {
			if (world[r][c] !== word[0]) continue;

			for (const [ro, co] of directions) {
				if (wordExistsAt(world, word, r, c, ro, co)) {
					yield {
						r,
						c,
						direction: { r: ro, c: co }
					}
				}
			}
		}
	}
}

function countGeneratorResults(generator: Generator) {
	let count = 0
	for (const _ of generator)
		count++
	return count;
}

function solveOne(data: string): any {
	return countGeneratorResults(findWords(data, 'XMAS', ALL_DIRECTIONS))
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
	assert.deepStrictEqual(solveOne(data), 2483);
})();


function solveTwo(data: string, word: string = 'MAS'): any {
	if (word.length % 2 === 0) {
		throw new Error('This does not work on even-length words')
	}

	const middleIndex = word.length - 1 - 1

	const middles: Record<string, number> = {}
	for (const { r, c, direction } of findWords(data, word, DIAGONAL_DIRECTIONS)) {
		const middleCoord = [r + direction.r * middleIndex, c + direction.c * middleIndex].join('|')
		middles[middleCoord] = (middles[middleCoord] ?? 0) + 1
	}
	return Object.values(middles).reduce((xmases, count) => xmases + +(count === 2), 0)
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
	assert.deepStrictEqual(solveTwo(data), 1925);
})();
