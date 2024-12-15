const fs = require('fs');
const assert = require('assert');


const toKey = (r: number, c: number) => {
	return r + '|' + c
}

type GardenPlot = { processed: Set<string>, perimeter: number, corners: number, type: string }

const CARDINAL_DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]]
const DIAGONAL_DIRECTIONS = [[-1, -1], [-1, 1], [1, 1], [1, -1]]

function floodFill(world: string[][], plot: GardenPlot, r: number, c: number) {
	plot.processed.add(toKey(r, c))

	for (const [ro, co] of DIAGONAL_DIRECTIONS) {
		const forward = [[r + ro, c], [r, c + co]]
		const behind = [[r - ro, c], [r, c - co]];

		const diagonalIsPartOfPlot = world[r + ro]?.[c + co] !== plot.type
		const allForwardAreNotPartOfPlot = forward.every(([r, c]) => world[r]?.[c] !== plot.type)
		const allForwardArePartOfPlot = forward.every(([r, c]) => world[r]?.[c] === plot.type)
		const allBehindArePartOfPlot = behind.every(([r, c]) => world[r]?.[c] === plot.type)

		if ((allBehindArePartOfPlot && allForwardAreNotPartOfPlot) || (diagonalIsPartOfPlot && allForwardArePartOfPlot)) {
			plot.corners++
		}
	}

	for (const [ro, co] of CARDINAL_DIRECTIONS) {
		const [nr, nc] = [r + ro, c + co];
		const neighbor = world[nr]?.[nc];
		if (neighbor !== plot.type) {
			plot.perimeter++
		} else if (!plot.processed.has(toKey(nr, nc))) {
			floodFill(world, plot, nr, nc);
		}
	}

	return plot
}

function parsePlots(garden: string[][]) {
	const plots: GardenPlot[] = []
	for (let r = 0; r < garden.length; r++) {
		for (let c = 0; c < garden[r].length; c++) {
			const type = garden[r][c];
			const key = toKey(r, c)
			if (plots.some(plot => plot.processed.has(key))) continue
			plots.push(floodFill(garden, { processed: new Set(), perimeter: 0, corners: 0, type }, r, c))
		}
	}

	return plots
}


function solveOne(data: string): any {
	const plots = parsePlots(data.replace(/\r/g, '').split('\n').map(l => [...l]))

	let totalPrice = 0;
	for (const { processed, perimeter } of plots) {
		totalPrice += processed.size * perimeter
	}
	return totalPrice
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`AAAA
BBCD
BBCC
EEEC`.trim()), 140);
	assert.deepStrictEqual(solveOne(`OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`.trim()), 772);
	console.log(solveOne(data));
})();

function solveTwo(data: string): any {
	const plots = parsePlots(data.replace(/\r/g, '').split('\n').map(row => [...row].flatMap(c => [c, c])).flatMap(row => [row, row]))

	let totalPrice = 0;
	for (const { processed, corners } of plots) {
		totalPrice += processed.size / 4 * corners
	}
	return totalPrice
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`
AAAA
BBCD
BBCC
EEEC`.trim()), 80);
	assert.deepStrictEqual(solveTwo(`EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`), 236);
	assert.deepStrictEqual(solveTwo(`
AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`.trim()), 368);
	assert.deepStrictEqual(solveTwo(`RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`), 1206);
	console.log(solveTwo(data));
})();
