const fs = require('fs');
const assert = require('assert');



const directionToVector = {
	'U': [-1, 0],
	'D': [1, 0],
	'L': [0, -1],
	'R': [0, 1],
}

const directions = ['U', 'R', 'D', 'L'];

function solveOne(data: string): any {
	const [rawMap, rawMoves] = data.split('\n\n');


	let maxR = -Infinity;
	let maxC = -Infinity;
	let minR = Infinity;
	let minC = Infinity;

	const world = new Map<string, '.' | '#'>()
	let current: [number, number, keyof typeof directionToVector] = [Infinity, Infinity, 'R']
	for (const [r, line] of rawMap.split('\n').entries()) {
		for (const [c, char] of [...line].entries()) {
			if (r + 1 > maxR) maxR = r + 1;
			if (r + 1 < minR) minR = r + 1;
			if (c + 1 > maxC) maxC = c + 1;
			if (c + 1 < minC) minC = c + 1;

			if (!char.trim()) continue;
			world.set(`${r + 1},${c + 1}`, char as '.' | '#');
			if (char === '.' && current[0] === Infinity && current[1] === Infinity) {
				current = [r + 1, c + 1, 'R'];
			}
		}
	}
	let vi = 0
	function visualize() {
		let lines: string[] = []
		for (let r = minR; r <= maxR; r++) {
			let line = '';
			for (let c = minC; c <= maxC; c++) {
				const char = world.get(`${r},${c}`);
				if (char === '#') {
					line += '#';
				} else if (r === current[0] && c === current[1]) {
					line += current[2];
				}
				else if (char === '.') {
					line += '.';
				} else {
					line += ' ';
				}
			}
			lines.push(line);
		}
		/*setTimeout(() => {
			console.clear();
			// @ts-ignore
			console.log(lines.join('\n'));
		}, 1000 * vi++);*/
	}

	function findEdgeFrom(r: number, c: number, dir: keyof typeof directionToVector): '.' | '#' | undefined {
		const [dr, dc] = directionToVector[dir];
		let last;
		let lastR = r;
		let lastC = c;
		while (r >= minR && r <= maxR && c >= minC && c <= maxC) {
			const next = world.get(`${r + dr},${c + dc}`);
			if (next) {
				last = next;
				lastR = r + dr;
				lastC = c + dc;
			}
			r += dr;
			c += dc;
		}
		// @ts-ignore
		return [last, lastR, lastC]
	}
	function makeMove(steps: number) {
		let [r, c, dir] = current;

		//console.log(current[2], steps);
		//visualize();
		const [dr, dc] = directionToVector[dir];
		for (let i = 0; i < steps; i++) {
			r = current[0];
			c = current[1];
			let next = world.get(`${r + dr},${c + dc}`);
			// @ts-ignore
			if (!next) {
				// @ts-ignore
				let [found, nr, nc] = findEdgeFrom(r, c, directions[(directions.indexOf(dir) + 2) % 4]);
				if (found === '.') {
					// @ts-ignore
					r = nr - dr;
					c = nc - dc;
				} else if (found === '#') next = '#';
			}
			if (next === '#') break

			current = [r + dr, c + dc, dir];
		}
	}

	let digits = '';
	for (let i = 0; i < rawMoves.length; i++) {
		const char = rawMoves[i];
		if (char === 'R' || char === 'L') {
			makeMove(parseInt(digits, 10));
			digits = '';
			if (char === 'L') {
				// @ts-ignore
				current[2] = directions[(directions.indexOf(current[2]) + 3) % 4];
			} else {
				// @ts-ignore
				current[2] = directions[(directions.indexOf(current[2]) + 1) % 4];
			}
			digits = '';
		} else {
			digits += char;
		}
	}
	if (digits) makeMove(parseInt(digits, 10));

	const directionToScore = {
		'U': 3,
		'D': 1,
		'L': 2,
		'R': 0,
	}
	return 1000 * current[0] + (4 * current[1]) + directionToScore[current[2]];
}

// -358432
(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`), 6032);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {

	const [rawMap, rawMoves] = data.split('\n\n');


	let maxR = -Infinity;
	let maxC = -Infinity;
	let minR = Infinity;
	let minC = Infinity;

	const world = new Map<string, '.' | '#'>()
	let current: [number, number, keyof typeof directionToVector] = [Infinity, Infinity, 'R']
	for (const [r, line] of rawMap.split('\n').entries()) {
		for (const [c, char] of [...line].entries()) {
			if (r + 1 > maxR) maxR = r + 1;
			if (r + 1 < minR) minR = r + 1;
			if (c + 1 > maxC) maxC = c + 1;
			if (c + 1 < minC) minC = c + 1;

			if (!char.trim()) continue;
			world.set(`${r + 1},${c + 1}`, char as '.' | '#');
			if (char === '.' && current[0] === Infinity && current[1] === Infinity) {
				current = [r + 1, c + 1, 'R'];
			}
		}
	}
	let vi = 0
	function visualize() {
		let lines: string[] = []
		for (let r = minR; r <= maxR; r++) {
			let line = '';
			for (let c = minC; c <= maxC; c++) {
				const char = world.get(`${r},${c}`);
				if (char === '#') {
					line += '#';
				} else if (r === current[0] && c === current[1]) {
					line += current[2];
				}
				else if (char === '.') {
					line += '.';
				} else {
					line += ' ';
				}
			}
			lines.push(line);
		}
		//setTimeout(() => {
		//console.clear();
		//console.log('\n\n')
		// @ts-ignore
		//console.log(lines.join('\n'));
		//}, 1000 * vi++);
	}

	function findEdgeFrom(r: number, c: number, dir: keyof typeof directionToVector): '.' | '#' | undefined {
		const [dr, dc] = directionToVector[dir];
		let last;
		let lastR = r;
		let lastC = c;
		while (r >= minR && r <= maxR && c >= minC && c <= maxC) {
			const next = world.get(`${r + dr},${c + dc}`);
			if (next) {
				last = next;
				lastR = r + dr;
				lastC = c + dc;
			}
			r += dr;
			c += dc;
		}
		// @ts-ignore
		return [last, lastR, lastC]
	}

	function wrapAroundCube(r: number, c: number, dir: keyof typeof directionToVector) {
		const [dr, dc] = directionToVector[dir];
		let [ar, ac] = [r + dr, c + dc];
		switch (dir) {
			case 'U':
				if (c <= 50) {
					dir = 'R';
					ar = c + 50;
					ac = 51;
				} else if (c <= 100) {
					dir = 'R';
					ar = c + 100;
					ac = 1;
				} else {
					dir = 'U';
					ar = 200;
					ac = c - 100;
				}
				break;
			case 'D':
				if (c <= 50) {
					dir = 'D';
					ar = 1;
					ac = c + 100;
				} else if (c <= 100) {
					dir = 'L';
					ar = c + 100;
					ac = 50;
				} else {
					dir = 'L';
					ar = c - 50;
					ac = 100;
				}
				break;
			case 'L':
				if (r <= 50) {
					dir = 'R';
					ar = 151 - r;
					ac = 1;
				} else if (r <= 100) {
					dir = 'D';
					ar = 101;
					ac = r - 50;
				} else if (r <= 150) {
					dir = 'R';
					ar = 151 - r;
					ac = 51;
				} else {
					dir = 'D';
					ar = 1;
					ac = r - 100;
				}
				break;
			case 'R':
				if (r <= 50) {
					dir = 'L'
					ar = 151 - r
					ac = 100;
				} else if (r <= 100) {
					dir = 'U'
					ar = 50;
					ac = 50 + r;
				} else if (r <= 150) {
					dir = 'L'
					ar = 151 - r;
					ac = 150
				} else {
					dir = 'U'
					ar = 150
					ac = r - 100
				}
				break;
		}

		return [ar, ac, dir];
	}

	function makeMove(steps: number) {
		let [r, c, dir] = current;

		//console.log(current[2], steps);
		//visualize();
		for (let i = 0; i < steps; i++) {
			visualize()
			const [dr, dc] = directionToVector[dir];
			r = current[0];
			c = current[1];
			let next = world.get(`${r + dr},${c + dc}`);
			// @ts-ignore
			if (!next) {
				// @ts-ignore

				//let [found, nr, nc] = findEdgeFrom(r, c, directions[(directions.indexOf(dir) + 2) % 4]);
				let [nr, nc, nd] = wrapAroundCube(r, c, dir);
				let found = world.get(`${nr},${nc}`);
				if (found === '.') {
					// @ts-ignore
					current = [nr, nc, nd];
					// @ts-ignore
					r = nr;
					// @ts-ignore
					c = nc;
					// @ts-ignore
					dir = nd;
					continue
				} else if (found === '#') next = '#';
			}
			if (next === '#') break

			current = [r + dr, c + dc, dir];
		}
	}

	let digits = '';
	for (let i = 0; i < rawMoves.length; i++) {
		const char = rawMoves[i];
		if (char === 'R' || char === 'L') {
			console.log((i / rawMoves.length) * 100)
			makeMove(parseInt(digits, 10));
			digits = '';
			if (char === 'L') {
				// @ts-ignore
				current[2] = directions[(directions.indexOf(current[2]) + 3) % 4];
			} else {
				// @ts-ignore
				current[2] = directions[(directions.indexOf(current[2]) + 1) % 4];
			}
			digits = '';
		} else {
			digits += char;
		}
	}
	if (digits) makeMove(parseInt(digits, 10));

	const directionToScore = {
		'U': 3,
		'D': 1,
		'L': 2,
		'R': 0,
	}

	return 1000 * current[0] + (4 * current[1]) + directionToScore[current[2]];
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	/*assert.deepStrictEqual(solveTwo(`        ...#
				.#..
				#...
				....
...#.......#
........#...
..#....#....
..........#.
				...#....
				.....#..
				.#......
				......#.

10R5L5R10L4R5L5`), 5031);*/
	console.log(solveTwo(data));
})();
