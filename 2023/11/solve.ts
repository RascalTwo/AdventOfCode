// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');

const parseUniverse = (data: string) => data.split('\n').map(line => line.split(''))

function expandUniverse(universe: string[][], extraRows = 1) {
	const newUniverse = [];
	for (const [r, row] of universe.entries()) {
		newUniverse.push(row)
		if (!row.includes('#')) {
			for (let i = 0; i < extraRows; i++)
				newUniverse.push([...row])
		}
	}
	for (let c = 0; c < newUniverse[0].length; c++) {
		const column = [];
		for (let r = 0; r < newUniverse.length; r++) {
			column.push(newUniverse[r][c])
		}
		if (column.includes('#')) continue;
		for (let r = 0; r < newUniverse.length; r++) {
			for (let i = 0; i < extraRows; i++)
				newUniverse[r].splice(c, 0, '.')
		}
		c += extraRows
	}

	return newUniverse
}

assert.deepStrictEqual(expandUniverse(parseUniverse(`...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`)), parseUniverse(`....#........
.........#...
#............
.............
.............
........#....
.#...........
............#
.............
.............
.........#...
#....#.......`))

const manhattenDistance = (a: [number, number], b: [number, number]) => {
	return Math.abs(a[1] - a[0]) + Math.abs(b[1] - b[0]);
}

const r2Distance = (a: [number, number], b: [number, number]) => {
	let dist = 0;
	const rDiff = b[0] - a[0];
	if (rDiff) {
		dist += Math.abs(rDiff)
	}
	const cDiff = b[1] - a[1];
	if (cDiff) {
		dist += Math.abs(cDiff)
	}
	return Math.abs(dist)
}


const r2Distance2 = (a: [number, number], b: [number, number], er: number[], rc: number[], extra = 1) => {
	let traveled = 0;

	let currentR = a[0];
	const destR = b[0];
	const velocityR = destR > currentR ? 1 : -1
	while (currentR !== destR) {
		currentR += velocityR
		traveled++
		if (er.includes(currentR)) traveled += extra
	}

	let currentC = a[1];
	const destC = b[1];
	const velocityC = destC > currentC ? 1 : -1
	while (currentC !== destC) {
		currentC += velocityC
		traveled++
		if (rc.includes(currentC)) traveled += extra
	}
	return traveled
}


function solveOne(data: string): any {
	const universe = expandUniverse(parseUniverse(data))
	const galaxyCoords: [number, number][] = [];
	for (const [r, row] of universe.entries()) {
		for (const [c, col] of row.entries()) {
			if (col === '#') {
				galaxyCoords.push([r, c])
			}
		}
	}

	const galaxyCoordPairs: [[number, number], [number, number]][] = [];
	for (const [i, one] of galaxyCoords.entries()) {
		for (const [j, two] of galaxyCoords.slice(i).entries()) {
			if (one.toString() === two.toString()) continue
			galaxyCoordPairs.push([one, two])
		}
	}

	const distances = galaxyCoordPairs.map(([a, b]) => r2Distance(a, b))
	return distances.reduce((a, b) => a + b, 0)
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

function spreadGalaxiesApart(galaxyCoords: [number, number][], extra = 1) {
	const minR = Math.min(...galaxyCoords.map(coord => coord[0]));
	let maxR = Math.max(...galaxyCoords.map(coord => coord[0]));
	const minC = Math.min(...galaxyCoords.map(coord => coord[1]));
	let maxC = Math.max(...galaxyCoords.map(coord => coord[1]));
	for (let r = minR + 1; r < maxR; r++) {
		if (galaxyCoords.some(gc => gc[0] === r)) continue;
		galaxyCoords.filter(gc => gc[0] > r).forEach(gc => gc[0] += extra)
		//maxR = Math.max(...galaxyCoords.map(coord => coord[0]));
	}
	for (let c = minC + 1; c < maxC; c++) {
		if (galaxyCoords.some(gc => gc[1] === c)) continue;
		galaxyCoords.filter(gc => gc[1] > c).forEach(gc => gc[1] += extra)
		//maxC = Math.max(...galaxyCoords.map(coord => coord[1]));
	}
}

function solveTwo(data: string, extraRows = 1): any {
	const universe = parseUniverse(data);
	const galaxyCoords: [number, number][] = [];
	for (const [r, row] of universe.entries()) {
		for (const [c, col] of row.entries()) {
			if (col === '#') {
				galaxyCoords.push([r, c])
			}
		}
	}
	//spreadGalaxiesApart(galaxyCoords, extraRows)

	const galaxyCoordPairs: [[number, number], [number, number]][] = [];
	for (const [i, one] of galaxyCoords.entries()) {
		for (const [j, two] of galaxyCoords.slice(i).entries()) {
			if (one.toString() === two.toString()) continue
			galaxyCoordPairs.push([one, two])
		}
	}

	const emptyRows: number[] = [];
	for (let r = 0; r < universe.length; r++) {
		if (!universe[r].includes('#'))
			emptyRows.push(r)
	}
	const emptyCols: number[] = []
	for (let c = 0; c < universe[0].length; c++) {
		const column = [];
		for (let r = 0; r < universe.length; r++) {
			column.push(universe[r][c])
		}
		if (column.includes('#')) continue;
		emptyCols.push(c)
	}
	const distances = galaxyCoordPairs.map(([a, b]) => r2Distance2(a, b, emptyRows, emptyCols, extraRows))
	return distances.reduce((a, b) => a + b, 0)
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
#...#.....`), 374);
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
