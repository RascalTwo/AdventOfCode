// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');

function rollNorth(world: string[][]) {
	for (let c = 0; c < world[0].length; c++) {
		for (let r = 1; r < world.length; r++) {
			if (world[r][c] !== 'O') continue;

			let rDest = r;
			for (let attempt = r - 1; attempt >= 0; attempt--) {
				if (world[attempt][c] !== '.') break
				rDest = attempt;
			}
			if (rDest !== r) {
				world[r][c] = world[rDest][c];
				world[rDest][c] = 'O';
			}
		}
	}
}

function calculateNorthLoad(world: string[][]): number {
	let totalLoad = 0
	for (let r = 0; r < world.length; r++) {
		const load = world.length - r;
		totalLoad += world[r].reduce((acc, cell) => cell === 'O' ? acc + 1 : acc, 0) * load;
	}
	return totalLoad
}

function solveOne(data: string): any {
	const world = data.trim().split('\n').map(line => line.split(''));
	rollNorth(world);
	return calculateNorthLoad(world);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`), 136);
	console.log(solveOne(data));
})();


function rotateClockwise(world: string[][]) {
	const newWorld = [];
	for (let c = world[0].length - 1; c >= 0; c--) {
		const newRow = [];
		for (let r = 0; r < world.length; r++) {
			newRow.push(world[r][c]);
		}
		newWorld.push(newRow.reverse());
	}
	return newWorld.reverse();
}
assert.deepStrictEqual(rotateClockwise([
	['1', 'N', '3'],
	['W', '5', 'E'],
	['7', 'S', '9'],
]), [
	['7', 'W', '1'],
	['S', '5', 'N'],
	['9', 'E', '3'],
]);


function solveTwo(data: string): any {
	let world = data.trim().split('\n').map(line => line.split(''));

	const northsSeen = new Map<string, number>();
	for (let cycle = 0; cycle < 1_000_000_000; cycle++) {
		const stringWorld = world.map(row => row.join('')).join('\n');
		if (northsSeen.has(stringWorld)) {
			const cycleLength = cycle - northsSeen.get(stringWorld)!;
			cycle += Math.floor((1_000_000_000 - cycle) / cycleLength) * cycleLength;
		}
		northsSeen.set(stringWorld, cycle);

		rollNorth(world);       			  // Rolled North
		world = rotateClockwise(world); // North = West
		rollNorth(world);       				// Rolled West
		world = rotateClockwise(world); // North = South
		rollNorth(world);       				// Rolled South
		world = rotateClockwise(world); // North = East
		rollNorth(world);       				// Rolled East
		world = rotateClockwise(world); // North = North
	}

	return calculateNorthLoad(world);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`), 64);
	console.log(solveTwo(data));
})();
