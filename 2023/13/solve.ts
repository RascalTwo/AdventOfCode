// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');

function calculateMirrorDifferenceHorizontal(world: string[][], r: number): number {
	const rows = Math.min(r, world.length - r)

	let differences = 0
	for (let ro = 0; ro < rows; ro++)
		for (let c = 0; c < world[0].length; c++)
			if (world[r + ro][c] !== world[r - ro - 1][c])
				differences++

	return differences;
}
assert.deepStrictEqual(calculateMirrorDifferenceHorizontal(`
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.
`.trim().split('\n').map(l => l.split('')), 3), 1);
assert.deepStrictEqual(calculateMirrorDifferenceHorizontal(`
#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`.trim().split('\n').map(l => l.split('')), 4), 0);

function calculateMirrorDifferenceVertical(world: string[][], c: number): number {
	const cols = Math.min(c, world[0].length - c)

	let differences = 0
	for (let co = 0; co < cols; co++)
		for (let r = 0; r < world.length; r++)
			if (world[r][c + co] !== world[r][c - co - 1])
				differences++

	return differences;
}


function solve(data: string, requiredDifferences: number): any {
	const worlds = data.split('\n\n').map((world) => world.split('\n').map((line) => line.split('')));

	let rows = 0, cols = 0;
	for (const world of worlds) {
		for (let r = 0; r < world.length; r++)
			if (calculateMirrorDifferenceHorizontal(world, r) === requiredDifferences)
				rows += r

		for (let r = 0; r < world.length; r++)
			if (calculateMirrorDifferenceVertical(world, r) === requiredDifferences)
				cols += r
	}


	return rows * 100 + cols;
}

function solveOne(data: string): any {
	return solve(data, 0);
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`), 405);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	return solve(data, 1);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`), 400);
	console.log(solveTwo(data));
})();
