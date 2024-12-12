const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	const world = data.trim().replace(/\r/g, '').split('\n').map(l => [...l]);
	const antennas: Record<string, { r: number, c: number }[]> = {};
	for (let r = 0; r < world.length; r++) {
		for (let c = 0; c < world[r].length; c++) {
			if (world[r][c] !== '.') {
				const antenna = world[r][c];
				if (!(antenna in antennas)) antennas[antenna] = [];
				antennas[antenna].push({ r, c })
			}
		}
	}

	for (const type in antennas) {
		for (const a of antennas[type]) {
			for (const b of antennas[type]) {
				if (a === b) continue;
				const rDiff = a.r - b.r;
				const cDiff = a.c - b.c
				const nextR = a.r + rDiff;
				const nextC = a.c + cDiff
				if (world[nextR]?.[nextC] !== undefined) {
					world[nextR][nextC] = '#'
				}
			}
		}
	}

	let hashes = 0;
	for (const row of world) {
		for (const cell of row) {
			if (cell === '#') hashes++
		}
	}
	return hashes
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`
..........
..........
..........
....a.....
..........
.....a....
..........
..........
..........
..........
`.trim()), 2);
	assert.deepStrictEqual(solveOne(`
..........
..........
..........
....a.....
........a.
.....a....
..........
......A...
..........
..........
`.trim()), 4);
	assert.deepStrictEqual(solveOne(`
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`.trim()), 14);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const world = data.trim().replace(/\r/g, '').split('\n').map(l => [...l]);
	const antennas: Record<string, { r: number, c: number }[]> = {};
	for (let r = 0; r < world.length; r++) {
		for (let c = 0; c < world[r].length; c++) {
			if (world[r][c] !== '.') {
				const antenna = world[r][c];
				if (!(antenna in antennas)) antennas[antenna] = [];
				antennas[antenna].push({ r, c })
			}
		}
	}

	for (const type in antennas) {
		for (const a of antennas[type]) {
			for (const b of antennas[type]) {
				if (a === b) continue;
				world[a.r][a.c] = '#'
				world[b.r][b.c] = '#'
				const rDiff = a.r - b.r;
				const cDiff = a.c - b.c
				let nextR = a.r + rDiff;
				let nextC = a.c + cDiff
				while (world[nextR]?.[nextC] !== undefined) {
					world[nextR][nextC] = '#'
					nextR += rDiff;
					nextC += cDiff;
				}
			}
		}
	}

	let hashes = 0;
	for (const row of world) {
		for (const cell of row) {
			if (cell === '#') hashes++
		}
	}
	return hashes
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`
T.........
...T......
.T........
..........
..........
..........
..........
..........
..........
..........`.trim()), 9);
	assert.deepStrictEqual(solveTwo(`
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`.trim()), 34);
	console.log(solveTwo(data));
})();
