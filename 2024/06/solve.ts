const fs = require('fs');
const assert = require('assert');

type Loc2 = { r: number, c: number, direction: [number, number] }

const GUARD_DIRECTIONS: [number, number][] = [
	[-1, 0],
	[0, 1],
	[1, 0],
	[0, -1],
]

function parseMap(data: string) {
	const world = data.split('\n').map(l => [...l]);
	for (let r = 0; r < world.length; r++) {
		for (let c = 0; c < world[r].length; c++) {
			if (world[r][c] === '^') {
				return {
					world,
					loc: { r, c, direction: GUARD_DIRECTIONS[0] } as Loc2
				}
			}
		}
	}
}

function pathfindRobot(loc: Loc2, world: string[][]) {
	let visited = new Set<string>();
	while (loc.r >= 0 && loc.r < world.length && loc.c >= 0 && loc.c < world[0].length) {
		const locJSON = JSON.stringify(loc)
		if (visited.has(locJSON)) {
			return {
				loop: true,
				visited
			}
		}
		visited.add(locJSON)

		const [ro, co] = loc.direction
		const [nr, nc] = [loc.r + ro, loc.c + co]
		const inFront = world[nr]?.[nc]
		if (inFront === '#') {
			loc.direction = GUARD_DIRECTIONS[(GUARD_DIRECTIONS.indexOf(loc.direction) + 1) % GUARD_DIRECTIONS.length]
		} else {
			loc.r = nr;
			loc.c = nc;
		}
	}
	return {
		loop: false,
		visited
	};
}

function getRidOfDuplicateLocations(visited: Set<string>) {
	return new Set(
		[...visited]
			.map(json => JSON.parse(json) as Loc2)
			.map(({ r, c }) => ({ r, c }))
			.map(loc => JSON.stringify(loc))
	)
}

function solveOne(data: string): any {
	const { world, loc } = parseMap(data)!

	const { visited } = pathfindRobot(loc, world)
	return getRidOfDuplicateLocations(visited).size
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`), 41);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const { loc, world } = parseMap(data)!;
	const { visited } = pathfindRobot({ ...loc }, world)
	const possibleObstructions = [...getRidOfDuplicateLocations(visited)].map(s => JSON.parse(s))

	let loopsFound = 0
	for (const { r, c } of possibleObstructions) {
		world[r][c] = '#'
		loopsFound += +pathfindRobot({ ...loc }, world).loop
		world[r][c] = '.'
	}
	return loopsFound
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`.trim()), 6);
	console.log(solveTwo(data));
})();
