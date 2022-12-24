const fs = require('fs');
const assert = require('assert');


type World = Map<string, [number, number][] | '#'>;

const parseWorld = (data: string): [number, number, World] => {
	const charToValue: Record<string, any> = {
		'#': '#',
		'>': [[0, 1]],
		'<': [[0, -1]],
		'^': [[-1, 0]],
		'v': [[1, 0]],
	}
	const rows = data.split('\n').length;
	const columns = data.split('\n')[0].length;

	const world: World = new Map();
	for (const [r, row] of data.split('\n').entries()) {
		for (const [c, col] of [...row].entries()) {
			const value = charToValue[col];
			if (value) world.set(`${r},${c}`, value);
		}
	}

	world.set(`${rows},${columns - 2}`, '#');
	world.set(`${-1},${1}`, '#');

	return [rows, columns, world];
}

const offsets = [[-1, 0], [0, 1], [1, 0], [0, -1], [0, 0]];

function minutesToNavigate(rows: number, columns: number, world: World, start: [number, number], [er, ec]: [number, number]) {
	let elves = new Set<string>([start.join(',')]);

	for (let m = 1; elves.size; m++) {
		const newWorld: World = new Map();
		for (const [key, blizzards] of world.entries()) {
			if (blizzards === '#') {
				newWorld.set(key, '#');
				continue;
			}

			const [r, c] = key.split(',').map(Number);
			for (const velocity of blizzards) {
				const [vr, vc] = velocity;
				let [nr, nc] = [r + vr, c + vc];
				if (world.get(`${nr},${nc}`) === '#') {
					if (vr === 1) nr = 1
					else if (vr === -1) nr = rows - 2
					else if (vc === 1) nc = 1
					else if (vc === -1) nc = columns - 2
				}

				const nextBlizzards = newWorld.get(`${nr},${nc}`) as [number, number][];
				if (nextBlizzards) nextBlizzards.push(velocity);
				else newWorld.set(`${nr},${nc}`, [velocity]);
			}
		}

		world.clear();
		for (const [key, blizzards] of newWorld.entries()) world.set(key, blizzards);

		const newElves = new Set<string>();
		for (const elf of elves) {
			const [r, c] = elf.split(',').map(Number);
			for (const [dr, dc] of offsets) {
				const [nr, nc] = [r + dr, c + dc];
				if (nr === er && nc === ec) return m;

				if (!world.has(`${nr},${nc}`)) newElves.add(`${nr},${nc}`);
			}
		}
		elves = newElves;
	}

	return -1;
}

function solveOne(data: string): any {
	const [rows, columns, world] = parseWorld(data);
	return minutesToNavigate(rows, columns, world, [0, 1], [rows - 1, columns - 2]);
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
	const [rows, columns, world] = parseWorld(data);
	return (
			minutesToNavigate(rows, columns, world, [0, 1], [rows - 1, columns - 2])
		+ minutesToNavigate(rows, columns, world, [rows - 1, columns - 2], [0, 1])
		+ minutesToNavigate(rows, columns, world, [0, 1], [rows - 1, columns - 2])
	);
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
