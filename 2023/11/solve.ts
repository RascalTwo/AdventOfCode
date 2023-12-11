// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');

const manhattanDistance = (a: [number, number], b: [number, number]) => {
	return Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1])
}

const generatePairs = <T>(array: T[]) => {
	const pairs: [T, T][] = [];
	for (const [i, one] of array.entries())
		for (const two of array.slice(i))
			if (JSON.stringify(one) !== JSON.stringify(two))
				pairs.push([one, two])

	return pairs
}

const parseUniverse = (data: string) => data.split('\n').map(line => line.split(''))

const locateGalaxies = (universe: string[][]) => {
	const galaxies: [number, number][] = [];
	for (const [r, row] of universe.entries())
		for (const [c, col] of row.entries())
			if (col === '#')
				galaxies.push([r, c])

	return galaxies
}

function spreadGalaxiesApart(galaxies: [number, number][], extra = 1) {
	const bounds = galaxies[0].map(() => ({ min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER }));
	for (const galaxy of galaxies) {
		for (const [d, bound] of bounds.entries()) {
			bound.min = Math.min(bound.min, galaxy[d])
			bound.max = Math.max(bound.max, galaxy[d])
		}
	}

	for (const [d, { min, max }] of bounds.entries())
		for (let curr = max; curr >= min + 1; curr--)
			if (!galaxies.some(gc => gc[d] === curr))
				galaxies.filter(gc => gc[d] > curr).forEach(gc => gc[d] += extra)

	return galaxies
}

function solve(data: string, extraSpace = 1): any {
	const galaxies = spreadGalaxiesApart(locateGalaxies(parseUniverse(data)), extraSpace)

	return generatePairs(galaxies)
		.map(([from, to]) => manhattanDistance(from, to))
		.reduce((a, b) => a + b, 0)
}

function solveOne(data: string): any {
	return solve(data, 1);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`), 374);
	console.log(solveOne(data));
})();


function solveTwo(data: string, extraSpace: number): any {
	return solve(data, extraSpace);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`, 1), 374);
	assert.deepStrictEqual(solveTwo(`...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`, 9), 1030);
	assert.deepStrictEqual(solveTwo(`...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`, 99), 8410);
	console.log(solveTwo(data, 1_000_000 - 1));
})();
