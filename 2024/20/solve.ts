const fs = require('fs');
const assert = require('assert');


type Location = { r: number, c: number };

function encodeLocation(loc: Location) {
	return loc.r + '|' + loc.c
}
function decodeLocation(encodedLocation: string): Location {
	const [r, c] = encodedLocation.split('|').map(Number);
	return { r, c }
}

const CARDINAL_DIRECTIONS = [[-1, 0], [1, 0], [0, 1], [0, -1]]

function solveOne(data: string, cheatDistance: number, cheatMinimum: number): any {
	const world = data.split('\n').map(row => [...row])

	let start: Location = { r: -1, c: -1 };
	let end: Location = { r: -1, c: -1 };
	for (let r = 0; r < world.length; r++) {
		for (let c = 0; c < world[r].length; c++) {
			const char = world[r][c];
			if (char === 'S') {
				start = { r, c }
				world[r][c] = '.'
			}
			if (char === 'E') {
				end = { r, c }
				world[r][c] = '.'
			}
		}
	}

	const encodedStart = encodeLocation(start)
	const encodedEnd = encodeLocation(end)

	const times: { [encodedLocation: string]: number } = {}
	times[encodedStart] = 0;

	const queue = [encodedStart]
	while (queue.length) {
		const current = queue.shift()!;

		if (current === encodedEnd) {
			break
		}

		const { r, c } = decodeLocation(current)
		for (const [ro, co] of CARDINAL_DIRECTIONS) {
			const [nr, nc] = [r + ro, c + co];
			if (world[nr]?.[nc] !== '.') continue
			const neighbor = encodeLocation({ r: nr, c: nc });
			const newTime = times[current] + 1
			const neighborTime = times[neighbor] ?? Infinity
			if (newTime < neighborTime) {
				times[neighbor] = times[current] + 1
				queue.push(neighbor)
				break
			}
		}
	}

	let goodToCheat = 0
	const saveCounts: Record<number, number> = {}
	for (let ar = 0; ar < world.length; ar++) {
		for (let ac = 0; ac < world[ar].length; ac++) {
			if (world[ar][ac] !== '.') continue;
			for (let br = 0; br < world.length; br++) {
				for (let bc = 0; bc < world[br].length; bc++) {
					if (world[br][bc] !== '.') continue;

					const distance = Math.abs(ar - br) + Math.abs(ac - bc);
					if (distance > cheatDistance) continue

					const timeToA = times[encodeLocation({ r: ar, c: ac })]
					const timeToB = times[encodeLocation({ r: br, c: bc })]
					const newTimeToB = timeToA + distance
					const saved = timeToB - newTimeToB;
					if (saved <= 1) continue;
					if (!(saved in saveCounts)) saveCounts[saved] = 0;
					saveCounts[saved]++
					if (saved >= cheatMinimum) {
						goodToCheat++
					}
				}
			}
		}
	}

	return goodToCheat
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`.trim(), 2, 0), 44);
	console.log(solveOne(data, 2, 100));
})();


function solveTwo(data: string): any {
	return solveOne(data, 20, 100);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	console.log(solveTwo(data));
})();

export { }