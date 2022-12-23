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
		setTimeout(() => {
			console.clear();
			// @ts-ignore
			console.log(lines.join('\n'));
		}, 1000 * vi++);
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
			console.log('\n\n')
			// @ts-ignore
			console.log(lines.join('\n'));
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
				if (ar === 0) {
					// 1 top to 2 top inverted
					//ac = ac - 4 - 4
					ar = ar + 4
					ar++
					if (ac === 9) ac = 4
					if (ac === 10) ac = 3
					if (ac === 11) ac = 2
					if (ac === 12) ac = 1
					dir = 'D'
				}
				if (ar === 4) {
					if (ac >= 1 && ac <= 4) {
						// 2 top to 1 top inverted
						//ac = ac + 4 + 4
						ar = ar - 4
						ar++

						if (ac === 1) ac = 12
						if (ac === 2) ac = 11
						if (ac === 3) ac = 10
						if (ac === 4) ac = 9
						dir = 'D'
					} else {
						// 3 top to 1 left
						if (ac === 5) {
							ac = ac + 4
							ar = ar - 3
						}
						if (ac === 6) {
							ac = ac + 3
							ar = ar - 2
						}
						if (ac === 7) {
							ac = ac + 2
							ar = ar - 1
						}
						if (ac === 8) {
							ac = ac + 1
						}
						dir = 'R'
					}
				}
				if (ar === 8) {
					// 6 top to 4 right
					if (ac === 16) {
						ac = ac - 4
						ar = ar - 3
					}
					if (ac === 15) {
						ac = ac - 3
						ar = ar - 2
					}
					if (ac === 14) {
						ac = ac - 2
						ar = ar - 1
					}
					if (ac === 13) {
						ac = ac - 1
					}
					dir = 'L'
				}
				break;
			case 'D':
				if (ar === 9) {
					if (ac >= 1 && ac <= 4) {
						// 2 bottom to 5 bottom
						ar = ar + 4;
						//ac = ac + 4 + 4
						if (ac === 1) ac = 12
						if (ac === 2) ac = 11
						if (ac === 3) ac = 10
						if (ac === 4) ac = 9
						dir = 'U'
					} else {
						// 3 bottom to 5 left
						if (ac === 5) {
							ac = ac + 4
							ar = ar + 3
						}
						if (ac === 6) {
							ac = ac + 3
							ar = ar + 2
						}
						if (ac === 7) {
							ac = ac + 2
							ar = ar + 1
						}
						if (ac === 8) {
							ac = ac + 1
						}
						dir = 'R'
					}
				} else {
					if (ac >= 9 && ac <= 12) {
						// 5 bottom to 2 bottom
						ar = ar - 5
						//ac = ac - 4 - 4
						if (ac === 9) ac = 4
						if (ac === 10) ac = 3
						if (ac === 11) ac = 2
						if (ac === 12) ac = 1
						dir = 'U'
					} else {
						// 6 bottom to 2 left
						ac = 1
						if (ac === 16) {
							ar = 5
						}
						if (ac === 15) {
							ar = 6
						}
						if (ac === 14) {
							ar = 7
						}
						if (ac === 13) {
							ar = 8
						}
						dir = 'R'
					}
				}
				break;
			case 'L':
				if (ac === 0) {
					// 2 left to 6 bottom
					ar = 12
					if (ar === 5){
						ac = 16
					}
					if (ar === 6){
						ac = 15
					}
					if (ar === 7){
						ac = 14
					}
					if (ar === 8){
						ac = 13
					}
					dir = 'U'
				} else {
					if (ar >= 1 && ar <= 4){
						// 1 left to 3 top
						if (ar === 1) {
							ar = ar + 4
							ac = ac - 3
						}
						if (ar === 2) {
							ar = ar + 3
							ac = ac - 2
						}
						if (ar === 3) {
							ar = ar + 2
							ac = ac - 1
						}
						if (ar === 4) {
							ar = ar + 1
						}
						dir = 'D'
					} else {
						// 5 left to 3 bottom
						if (ar === 12) {
							ar = ar - 4
							ac = ac - 3
						}
						if (ar === 11) {
							ar = ar - 3
							ac = ac - 2
						}
						if (ar === 10) {
							ar = ar - 2
							ac = ac - 1
						}
						if (ar === 9) {
							ar = ar - 1
						}
						dir = 'U'
					}
				}
				break;
			case 'R':
				if (ac === 17) {
					// 6 right to 1 right
					ac = ac - 5
					if (ar === 9) ar = 4
					if (ar === 10) ar = 3
					if (ar === 11) ar = 2
					if (ar === 12) ar = 1
					dir = 'L'
				} else if (ar >= 1 && ar <= 4) {
					// 1 right to 6 right
					ac = ac + 3
					if (ar === 1) ar = 12
					if (ar === 2) ar = 11
					if (ar === 3) ar = 10
					if (ar === 4) ar = 9
					dir = 'L'
				} else {
					// 4 right to 6 top
					if (ar === 5) {
						ar = ar + 4
						ac = ac + 3
					}
					if (ar === 6) {
						ar = ar + 3
						ac = ac + 2
					}
					if (ar === 7) {
						ar = ar + 2
						ac = ac + 1
					}
					if (ar === 8) {
						ar = ar + 1
					}
					dir = 'D'
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
	console.log(current)
	return 1000 * current[0] + (4 * current[1]) + directionToScore[current[2]];
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`        ...#
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

10R5L5R10L4R5L5`), 5031);
	//console.log(solveTwo(data));
})();
