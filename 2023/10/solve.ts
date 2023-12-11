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
	'L': [Direction.Up, Direction.Right]
}

const DIRECTIONS_TO_OFFSETS = {
	[Direction.Up]: [-1, 0],
	[Direction.Right]: [0, 1],
	[Direction.Down]: [1, 0],
	[Direction.Left]: [0, -1]
}

function directionsToChar(directions: [Direction, Direction]): keyof typeof CHAR_TO_DIRECTIONS {
	for (const [char, dirs] of Object.entries(CHAR_TO_DIRECTIONS)) {
		if (JSON.stringify(dirs.sort()) === JSON.stringify(directions.sort())) return char as keyof typeof CHAR_TO_DIRECTIONS;
	}

	throw new Error('No match found')
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

	field[start[0]][start[1]].char = directionsToChar(field[start[0]][start[1]].directions as [Direction, Direction])
}

function solveOne(data: string): any {
	const [start, field] = parseField(data);
	calculateStartChar(field, start);

	const stack = [{ loc: start, distance: 0 }]

	while (stack.length) {
		const { loc, distance } = stack.shift()!;
		if (field[loc[0]][loc[1]].distance !== Number.MIN_SAFE_INTEGER && field[loc[0]][loc[1]].distance <= distance) continue;
		field[loc[0]][loc[1]].distance = distance;
		for (const direction of field[loc[0]][loc[1]].directions) {
			const [dr, dc] = DIRECTIONS_TO_OFFSETS[direction];
			stack.push({ loc: [loc[0] + dr, loc[1] + dc], distance: distance + 1 })
		}
		stack.sort((a, b) => a.distance - b.distance)
	}

	return Math.max(...field.flat().map(p => p.distance === Number.MIN_SAFE_INTEGER ? 0 : p.distance));
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


function solveTwo(data: string): any {
	const lines = data.trim().split('\n').map(line => line.split(''));
	for (let r = 0; r < lines.length; r++)
		lines[r] = ['.', ...lines[r], '.'];
	lines.unshift(Array(lines[0].length).fill('.'));
	lines.push(Array(lines[0].length).fill('.'));
	data = lines.map(line => line.join('')).join('\n');

	const [start, field] = parseField(data);
	calculateStartChar(field, start);

	const loopStack = [{ loc: start, distance: 0 }]

	while (loopStack.length) {
		const { loc, distance } = loopStack.shift()!;
		if (field[loc[0]][loc[1]].distance !== Number.MIN_SAFE_INTEGER && field[loc[0]][loc[1]].distance <= distance) continue;
		field[loc[0]][loc[1]].distance = distance;
		for (const direction of field[loc[0]][loc[1]].directions) {
			const [dr, dc] = DIRECTIONS_TO_OFFSETS[direction];
			loopStack.push({ loc: [loc[0] + dr, loc[1] + dc], distance: distance + 1 })
		}
		loopStack.sort((a, b) => a.distance - b.distance)
	}

	for (const row of field) {
		for (const loc of row) {
			if (loc.distance === Number.MIN_SAFE_INTEGER) {
				loc.char = '.'
				loc.directions = []
			}
		}
	}

	const walls = [];
	for (const [r, row] of field.entries()) {
		const rows: number[][] = [[], [], []]
		for (const [c, loc] of row.entries()) {
			const subCell = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
			subCell[1][1] = loc.char === '.' ? 0 : 1;
			for (const direction of loc.directions) {
				const [dr, dc] = DIRECTIONS_TO_OFFSETS[direction];
				subCell[1 + dr][1 + dc] = 1;
			}
			for (const [l, line] of subCell.entries()) {
				rows[l].push(...line);
			}
		}
		walls.push(...rows);
	}

	const stack = [[0, 0]]
	const visited = new Set<string>();
	while (stack.length) {
		const [r, c] = stack.shift()!;
		const key = r + ',' + c;

		if (visited.has(key)) continue;
		visited.add(key);

		if (walls[r][c] === 1) continue;

		walls[r][c] = 2;
		for (const [dr, dc] of [[-1, 0], [0, 1], [1, 0], [0, -1]]) {
			const nr = r + dr;
			const nc = c + dc;
			if (walls[nr]?.[nc] === undefined) continue
			stack.push([nr, nc])
		}
	}

	let count = 0
	for (let r = 1 + 3; r < walls.length - 1 - 3; r += 3) {
		for (let c = 1 + 3; c < walls[r].length - 1 - 3; c += 3) {
			const char = walls[r][c];
			if (char === 0) count++
			walls[r][c] = 3;
		}
	}
	return count;
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
