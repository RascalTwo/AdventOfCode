const fs = require('fs');
const assert = require('assert');


interface Blizzard {
	velocity: [number, number];
}
function solveOne(data: string): any {
	const rows = data.split('\n').length;
	const columns = data.split('\n')[0].length;

	const world = new Map<string, Blizzard[] | '#'>();
	for (const [r, row] of data.split('\n').entries()) {
		for (const [c, col] of [...row].entries()) {
			if (col === '#') {
				world.set(`${r},${c}`, '#');
			}
			else if (col === '>') {
				world.set(`${r},${c}`, [{ velocity: [0, 1] }]);
			}
			else if (col === '<') {
				world.set(`${r},${c}`, [{ velocity: [0, -1] }]);
			}
			else if (col === '^') {
				world.set(`${r},${c}`, [{ velocity: [-1, 0] }]);
			}
			else if (col === 'v') {
				world.set(`${r},${c}`, [{ velocity: [1, 0] }]);
			}
		}
	}
	const end = [
		data.split('\n').length - 1,
		data.split('\n')[0].length - 2
	]

	world.set(`${end[0] + 1},${end[1]}`, '#');
	world.set(`${-1},${1}`, '#');

	function visualize() {
		for (let r = 0; r < rows; r++) {
			let row = '';
			for (let c = 0; c < columns; c++) {
				const blizzards = world.get(`${r},${c}`);
				if (blizzards === '#') {
					row += '#';
				}
				else if (blizzards) {
					if (blizzards.length === 1) {
						const [vr, vc] = blizzards[0].velocity;
						if (vr === 1) {
							row += 'v';
						}
						else if (vr === -1) {
							row += '^';
						}
						else if (vc === 1) {
							row += '>';
						}
						else if (vc === -1) {
							row += '<';
						}
					}
					else row += blizzards.length;
				}
				else {
					row += '.';
				}
			}
			console.log(row);
		}
	}

	interface Game {
		r: number;
		c: number;
	}

	let elves = new Set<string>([`0,1`]);
	let minutes = 0;
	while (elves.size) {
		minutes++;
		const newWorld = new Map<string, Blizzard[] | '#'>();
		for (const [key, blizzards] of world.entries()) {
			if (blizzards === '#') {
				newWorld.set(key, '#');
				continue;
			}

			const [r, c] = key.split(',').map(Number);
			for (const blizzard of blizzards) {
				const [vr, vc] = blizzard.velocity;
				const next = [r + vr, c + vc];
				if (world.get(`${next[0]},${next[1]}`) === '#') {
					if (vr === 1) {
						next[0] = 1
					} else if (vr === -1) {
						next[0] = rows - 2
					} else if (vc === 1) {
						next[1] = 1
					} else if (vc === -1) {
						next[1] = columns - 2
					}
				}
				const nextBlizzards = newWorld.get(`${next[0]},${next[1]}`) as Blizzard[];
				if (nextBlizzards) nextBlizzards.push(blizzard);
				else newWorld.set(`${next[0]},${next[1]}`, [blizzard]);
			}
		}

		world.clear();
		for (const [key, blizzards] of newWorld.entries()) world.set(key, blizzards);
		const newElves = new Set<string>();
		for (const elf of elves) {
			const [r, c ] = elf.split(',').map(Number);
			for (const dr of [-1, 0, 1]) {
				for (const dc of [-1, 0, 1]) {
					const dist = Math.abs(dr) + Math.abs(dc);
					if (dist > 1) continue;
					const next = [r + dr, c + dc];
					if (world.has(`${next[0]},${next[1]}`)) continue;
					if (next[0] === end[0] && next[1] === end[1]) {
						return minutes
					}
					newElves.add(`${next[0]},${next[1]}`);
				}
			}
		}
		elves = newElves;
	}

	return -1;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`), 18);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const rows = data.split('\n').length;
	const columns = data.split('\n')[0].length;

	const world = new Map<string, Blizzard[] | '#'>();
	for (const [r, row] of data.split('\n').entries()) {
		for (const [c, col] of [...row].entries()) {
			if (col === '#') {
				world.set(`${r},${c}`, '#');
			}
			else if (col === '>') {
				world.set(`${r},${c}`, [{ velocity: [0, 1] }]);
			}
			else if (col === '<') {
				world.set(`${r},${c}`, [{ velocity: [0, -1] }]);
			}
			else if (col === '^') {
				world.set(`${r},${c}`, [{ velocity: [-1, 0] }]);
			}
			else if (col === 'v') {
				world.set(`${r},${c}`, [{ velocity: [1, 0] }]);
			}
		}
	}
	let end = [
		data.split('\n').length - 1,
		data.split('\n')[0].length - 2
	]

	world.set(`${end[0] + 1},${end[1]}`, '#');
	world.set(`${-1},${1}`, '#');

	function visualize() {
		for (let r = 0; r < rows; r++) {
			let row = '';
			for (let c = 0; c < columns; c++) {
				const blizzards = world.get(`${r},${c}`);
				if (blizzards === '#') {
					row += '#';
				}
				else if (blizzards) {
					if (blizzards.length === 1) {
						const [vr, vc] = blizzards[0].velocity;
						if (vr === 1) {
							row += 'v';
						}
						else if (vr === -1) {
							row += '^';
						}
						else if (vc === 1) {
							row += '>';
						}
						else if (vc === -1) {
							row += '<';
						}
					}
					else row += blizzards.length;
				}
				else {
					row += '.';
				}
			}
			console.log(row);
		}
	}

	interface Game {
		r: number;
		c: number;
	}

	let elves = new Set<string>([`0,1`]);
	let minutes = 0;
	first: while (elves.size) {
		minutes++;
		const newWorld = new Map<string, Blizzard[] | '#'>();
		for (const [key, blizzards] of world.entries()) {
			if (blizzards === '#') {
				newWorld.set(key, '#');
				continue;
			}

			const [r, c] = key.split(',').map(Number);
			for (const blizzard of blizzards) {
				const [vr, vc] = blizzard.velocity;
				const next = [r + vr, c + vc];
				if (world.get(`${next[0]},${next[1]}`) === '#') {
					if (vr === 1) {
						next[0] = 1
					} else if (vr === -1) {
						next[0] = rows - 2
					} else if (vc === 1) {
						next[1] = 1
					} else if (vc === -1) {
						next[1] = columns - 2
					}
				}
				const nextBlizzards = newWorld.get(`${next[0]},${next[1]}`) as Blizzard[];
				if (nextBlizzards) nextBlizzards.push(blizzard);
				else newWorld.set(`${next[0]},${next[1]}`, [blizzard]);
			}
		}

		world.clear();
		for (const [key, blizzards] of newWorld.entries()) world.set(key, blizzards);
		const newElves = new Set<string>();
		for (const elf of elves) {
			const [r, c ] = elf.split(',').map(Number);
			for (const dr of [-1, 0, 1]) {
				for (const dc of [-1, 0, 1]) {
					const dist = Math.abs(dr) + Math.abs(dc);
					if (dist > 1) continue;
					const next = [r + dr, c + dc];
					if (world.has(`${next[0]},${next[1]}`)) continue;
					if (next[0] === end[0] && next[1] === end[1]) {
						elves = new Set<string>([`${next[0]},${next[1]}`]);
						break first;
					}
					newElves.add(`${next[0]},${next[1]}`);
				}
			}
		}
		elves = newElves;
	}

	end = [0, 1]
	second: while (elves.size) {
		minutes++;
		const newWorld = new Map<string, Blizzard[] | '#'>();
		for (const [key, blizzards] of world.entries()) {
			if (blizzards === '#') {
				newWorld.set(key, '#');
				continue;
			}

			const [r, c] = key.split(',').map(Number);
			for (const blizzard of blizzards) {
				const [vr, vc] = blizzard.velocity;
				const next = [r + vr, c + vc];
				if (world.get(`${next[0]},${next[1]}`) === '#') {
					if (vr === 1) {
						next[0] = 1
					} else if (vr === -1) {
						next[0] = rows - 2
					} else if (vc === 1) {
						next[1] = 1
					} else if (vc === -1) {
						next[1] = columns - 2
					}
				}
				const nextBlizzards = newWorld.get(`${next[0]},${next[1]}`) as Blizzard[];
				if (nextBlizzards) nextBlizzards.push(blizzard);
				else newWorld.set(`${next[0]},${next[1]}`, [blizzard]);
			}
		}

		world.clear();
		for (const [key, blizzards] of newWorld.entries()) world.set(key, blizzards);
		const newElves = new Set<string>();
		for (const elf of elves) {
			const [r, c ] = elf.split(',').map(Number);
			for (const dr of [-1, 0, 1]) {
				for (const dc of [-1, 0, 1]) {
					const dist = Math.abs(dr) + Math.abs(dc);
					if (dist > 1) continue;
					const next = [r + dr, c + dc];
					if (world.has(`${next[0]},${next[1]}`)) continue;
					if (next[0] === end[0] && next[1] === end[1]) {
						elves = new Set<string>([`${next[0]},${next[1]}`]);
						break second;
					}
					newElves.add(`${next[0]},${next[1]}`);
				}
			}
		}
		elves = newElves;
	}
	end = [
		data.split('\n').length - 1,
		data.split('\n')[0].length - 2
	]
	while (elves.size) {
		minutes++;
		const newWorld = new Map<string, Blizzard[] | '#'>();
		for (const [key, blizzards] of world.entries()) {
			if (blizzards === '#') {
				newWorld.set(key, '#');
				continue;
			}

			const [r, c] = key.split(',').map(Number);
			for (const blizzard of blizzards) {
				const [vr, vc] = blizzard.velocity;
				const next = [r + vr, c + vc];
				if (world.get(`${next[0]},${next[1]}`) === '#') {
					if (vr === 1) {
						next[0] = 1
					} else if (vr === -1) {
						next[0] = rows - 2
					} else if (vc === 1) {
						next[1] = 1
					} else if (vc === -1) {
						next[1] = columns - 2
					}
				}
				const nextBlizzards = newWorld.get(`${next[0]},${next[1]}`) as Blizzard[];
				if (nextBlizzards) nextBlizzards.push(blizzard);
				else newWorld.set(`${next[0]},${next[1]}`, [blizzard]);
			}
		}

		world.clear();
		for (const [key, blizzards] of newWorld.entries()) world.set(key, blizzards);
		const newElves = new Set<string>();
		for (const elf of elves) {
			const [r, c ] = elf.split(',').map(Number);
			for (const dr of [-1, 0, 1]) {
				for (const dc of [-1, 0, 1]) {
					const dist = Math.abs(dr) + Math.abs(dc);
					if (dist > 1) continue;
					const next = [r + dr, c + dc];
					if (world.has(`${next[0]},${next[1]}`)) continue;
					if (next[0] === end[0] && next[1] === end[1]) {
						return minutes;
					}
					newElves.add(`${next[0]},${next[1]}`);
				}
			}
		}
		elves = newElves;
	}

	return -1;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`), 54);
	console.log(solveTwo(data));
})();
