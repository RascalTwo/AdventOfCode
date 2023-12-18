const fs = require('fs');
const assert = require('assert');

type Dir = '^' | 'v' | '<' | '>';

const DIRECTIONS_TO_OFFSETS = {
	'^': [-1, 0],
	'v': [1, 0],
	'<': [0, -1],
	'>': [0, 1],
};

function generateDirections(direction: Dir, tile: string): Dir[] {
	switch (tile) {
		case '/':
			if (direction === '^') return ['>'];
			else if (direction === 'v') return ['<'];
			else if (direction === '<') return ['v'];
			else if (direction === '>') return ['^'];
			break;
		case '\\':
			if (direction === '^') return ['<'];
			else if (direction === 'v') return ['>'];
			else if (direction === '<') return ['^'];
			else if (direction === '>') return ['v'];
			break;
		case '|':
			if (direction === '<' || direction === '>') {
				return ['^', 'v'];
			}
			break;
		case '-':
			if (direction === '^' || direction === 'v') {
				return ['<', '>'];
			}
			break;
	}
	return [direction];
}

type Beam = { r: number, c: number, dir: Dir }

function countEnergizedTiles(grid: string[][], start: Beam) {
	const seen = new Set<string>();

	const beams: Beam[] = [start]
	while (beams.length > 0) {
		let { r, c, dir } = beams.pop()!;
		const [ro, co] = DIRECTIONS_TO_OFFSETS[dir]!
		const nr = r + ro;
		const nc = c + co;

		const key = [nr, nc, dir].join(',');
		if (seen.has(key)) continue;

		const tile = grid[nr]?.[nc];
		if (!tile) continue

		seen.add(key);
		for (const newDir of generateDirections(dir, tile))
			beams.push({ r: nr, c: nc, dir: newDir });
	}

	const energized = new Set();
	for (const x of seen)
		energized.add(x.split(',').slice(0, 2).join(','));

	return energized.size;
}

function solveOne(data: string): any {
	return countEnergizedTiles(data.trim().split('\n').map((line) => line.split('')), { r: 0, c: -1, dir: '>' });
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`), 46);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const world = data.trim().split('\n').map((line) => line.split(''))
	const rowCount = world.length;
	const colCount = world[0].length;

	let best = Number.MIN_SAFE_INTEGER;
	for (let c = 0; c < colCount; c++) {
		best = Math.max(best, countEnergizedTiles(world, { r: -1, c, dir: 'v' }));
		best = Math.max(best, countEnergizedTiles(world, { r: rowCount, c, dir: '^' }));
	}
	for (let r = 0; r < rowCount; r++) {
		best = Math.max(best, countEnergizedTiles(world, { r, c: -1, dir: '>' }));
		best = Math.max(best, countEnergizedTiles(world, { r, c: colCount, dir: '<' }));
	}
	return best
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`), 51);
	console.log(solveTwo(data));
})();
