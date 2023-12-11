// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');


enum Direction {
	Up = '^',
	Right = '>',
	Down = 'v',
	Left = '<'
}

const CHAR_TO_DIRECTIONS = {
	'F': [Direction.Down, Direction.Right],
	'7': [Direction.Left, Direction.Down],
	'|': [Direction.Up, Direction.Down],
	'J': [Direction.Up, Direction.Left],
	'-': [Direction.Left, Direction.Right],
	'L': [Direction.Up, Direction.Right],
	'.': [],
}

const DIRECTIONS_TO_CHARS = Object.fromEntries(Object.entries(CHAR_TO_DIRECTIONS).map(([char, dirs]) => [JSON.stringify(dirs.sort()), char]))

const DIRECTIONS_TO_OFFSETS = {
	[Direction.Up]: [-1, 0],
	[Direction.Right]: [0, 1],
	[Direction.Down]: [1, 0],
	[Direction.Left]: [0, -1]
}

type Loc = {
	char: string;
	directions: Direction[];
	distance: number
}

function parseField(data: string): [[number, number], Loc[][]] {
	let start: [number, number] = [-1, -1];

	const field = [];
	for (const [r, row] of data.trim().split('\n').entries()) {
		const newRow: Loc[] = [];
		for (const [c, char] of [...row].entries()) {
			if (char === 'S') {
				start = [r, c]
			}

			newRow.push({
				char,
				directions: CHAR_TO_DIRECTIONS[char as keyof typeof CHAR_TO_DIRECTIONS] ?? [],
				distance: Number.MIN_SAFE_INTEGER
			})
		}
		field.push(newRow);
	}

	return [start, field]
}

function calculateStartChar(field: Loc[][], start: [number, number]) {
	if (field[start[0]][start[1] - 1]?.directions.includes(Direction.Right))
		field[start[0]][start[1]].directions.push(Direction.Left)
	if (field[start[0]][start[1] + 1]?.directions.includes(Direction.Left))
		field[start[0]][start[1]].directions.push(Direction.Right)
	if (field[start[0] - 1]?.[start[1]].directions.includes(Direction.Down))
		field[start[0]][start[1]].directions.push(Direction.Up)
	if (field[start[0] + 1]?.[start[1]].directions.includes(Direction.Up))
		field[start[0]][start[1]].directions.push(Direction.Down)

	field[start[0]][start[1]].char = DIRECTIONS_TO_CHARS[JSON.stringify(field[start[0]][start[1]].directions.sort())]
}

function calculateMainLoopDistances(field: Loc[][], start: [number, number]) {
	{
		const queue = [{ loc: start, distance: 0 }]
		while (queue.length) {
			const { loc, distance } = queue.pop()!;
			if (field[loc[0]][loc[1]].distance !== Number.MIN_SAFE_INTEGER && field[loc[0]][loc[1]].distance <= distance) continue;
			field[loc[0]][loc[1]].distance = distance;
			for (const direction of field[loc[0]][loc[1]].directions) {
				const [ro, co] = DIRECTIONS_TO_OFFSETS[direction];
				queue.push({ loc: [loc[0] + ro, loc[1] + co], distance: distance + 1 })
			}
			queue.sort((a, b) => b.distance - a.distance)
		}
	}
}

function solveOne(data: string): any {
	const [start, field] = parseField(data);
	calculateStartChar(field, start);
	calculateMainLoopDistances(field, start);

	return Math.max(...field.flat().map(({ distance }) => distance === Number.MIN_SAFE_INTEGER ? 0 : distance));
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`.....
.S-7.
.|.|.
.L-J.
.....`), 4);
	assert.deepStrictEqual(solveOne(`..F7.
.FJ|.
SJ.L7
|F--J
LJ...`), 8);
	console.log(solveOne(data));
})();

function expandMatrix<T>(matrix: T[][], char: T) {
	for (let r = 0; r < matrix.length; r++)
		matrix[r] = [char, ...matrix[r], char];
	matrix.unshift(Array(matrix[0].length).fill(char));
	matrix.push(Array(matrix[0].length).fill(char));
	return matrix
}

function discardExtraPipes(field: Loc[][]) {
	for (const row of field)
		for (const loc of row)
			if (loc.distance === Number.MIN_SAFE_INTEGER)
				Object.assign(loc, { char: '.', directions: [] })
}

const CHARS_TO_PIXELS = Object.fromEntries(Object.entries(CHAR_TO_DIRECTIONS).map(([char, dirs]) => {
	const pixels = [[0, 0, 0], [0, +!!dirs.length, 0], [0, 0, 0]]
	for (const direction of dirs) {
		const [ro, co] = DIRECTIONS_TO_OFFSETS[direction];
		pixels[1 + ro][1 + co] = 1;
	}
	return [char, pixels]
}))

function zoomOut(field: Loc[][]) {
	const walls = [];
	for (const row of field) {
		const rows: number[][] = [[], [], []]
		for (const loc of row)
			for (const [l, line] of CHARS_TO_PIXELS[loc.char].entries())
				rows[l].push(...line);
		walls.push(...rows);
	}
	return walls
}

function floodFill(walls: number[][]) {
	const stack = [[0, 0]]
	while (stack.length) {
		const [r, c] = stack.shift()!;
		if (walls[r][c] !== 0) continue;

		walls[r][c] = 2;
		for (const [ro, co] of Object.values(DIRECTIONS_TO_OFFSETS)) {
			const nr = r + ro;
			const nc = c + co;
			if (walls[nr]?.[nc] !== undefined) stack.push([nr, nc])
		}
	}

	return walls
}

function countDrySpaces(walls: number[][]) {
	let count = 0
	for (let r = 4; r < walls.length - 4; r += 3)
		for (let c = 4; c < walls[r].length - 4; c += 3)
			count += +(walls[r][c] === 0)

	return count
}

function solveTwo(data: string): any {
	data = expandMatrix(data.trim().split('\n').map(line => line.split('')), '.').map(line => line.join('')).join('\n');

	const [start, field] = parseField(data);
	calculateStartChar(field, start);
	calculateMainLoopDistances(field, start);

	discardExtraPipes(field);

	const walls = zoomOut(field);
	floodFill(walls);

	return countDrySpaces(walls);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`.....
.S-7.
.|.|.
.L-J.
.....`), 1);
	assert.deepStrictEqual(solveTwo(`...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`), 4);
	assert.deepStrictEqual(solveTwo(`.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`), 8);
	assert.deepStrictEqual(solveTwo(`FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`), 10);
	console.log(solveTwo(data));
})();
