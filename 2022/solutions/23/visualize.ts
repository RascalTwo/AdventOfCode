const fs = require('fs');


const colors = require('colors');

const rotatableArray = <T>(arr: T[]) => ({
	start: 0,
	rotate() {
		if (++this.start >= arr.length) this.start = 0;
	},
	[Symbol.iterator]() {
		return (function* (this: { start: number }) {
			for (let i = 0; i < arr.length; i++) {
				yield arr[(this.start + i) % arr.length];
			}
		}).call(this);
	},
})

const directionToOffset = {
	north: [-1, 0],
	south: [1, 0],
	west: [0, -1],
	east: [0, 1],
}

function getBounds(data: string) {
	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;

	const directions = rotatableArray<keyof typeof directionToOffset>(['north', 'south', 'west', 'east'])

	const world = new Set<string>();
	for (const [r, row] of data.split('\n').entries()) {
		for (const [c, col] of [...row].entries()) {
			if (col === '#') world.add(`${r},${c}`);
		}
	}

	const moves = new Map<string, string[]>();
	for (let r = 0; r < 10; r++) {
		for (const elf of world) {
			const [er, ec] = elf.split(',').map(Number);

			minX = Math.min(minX, ec);
			maxX = Math.max(maxX, ec);
			minY = Math.min(minY, er);
			maxY = Math.max(maxY, er);

			const neighbors = [];
			for (let dr = -1; dr <= 1; dr++) {
				for (let dc = -1; dc <= 1; dc++) {
					if (!(dr === 0 && dc === 0) && world.has(`${er + dr},${ec + dc}`)) {
						neighbors.push(`${er + dr},${ec + dc}`);
					}
				}
			}
			if (neighbors.length === 0) continue;

			const directionalNeighbors: Record<keyof typeof directionToOffset, (n: string) => boolean> = {
				north: n => +n.split(',')[0] < er, south: n => +n.split(',')[0] > er,
				west: n => +n.split(',')[1] < ec, east: n => +n.split(',')[1] > ec,
			}
			for (const direction of directions) {
				if (neighbors.filter(directionalNeighbors[direction]).length > 0) continue;

				const offset = directionToOffset[direction];
				const coordinate = [er + offset[0], ec + offset[1]];
				const otherElves = moves.get(coordinate.join(',')) || [];
				otherElves.push(elf);
				moves.set(coordinate.join(','), otherElves);
				break;
			}
		}

		for (const [coord, [elf, other]] of moves.entries()) {
			if (other) continue;
			world.delete(elf);
			world.add(coord);
			const [er, ec] = coord.split(',').map(Number);

			minX = Math.min(minX, ec);
			maxX = Math.max(maxX, ec);
			minY = Math.min(minY, er);
			maxY = Math.max(maxY, er);
		}
		moves.clear();

		directions.rotate();
	}

	return {
		minX, maxX, minY, maxY
	}
}

const directionToChar = {
	north: '^',
	south: 'v',
	west: '<',
	east: '>',
}

async function doTheThing(data: string) {
	const { minX, maxX, minY, maxY } = getBounds(data);


	const directions = rotatableArray<keyof typeof directionToOffset>(['north', 'south', 'west', 'east'])

	const world = new Map<string, string>();
	for (const [r, row] of data.split('\n').entries()) {
		for (const [c, col] of [...row].entries()) {
			if (col === '#') world.set(`${r},${c}`, 'O');
		}
	}

	let movedThisRound = 0
	const processed = new Set<string>();
	const moves = new Map<string, string[]>();
	let r = 0;
	for (r = 0; r < 1000; r++) {
		visualize()
		await new Promise(r => setTimeout(r, 250));
		for (const elf of world.keys()) {
			processed.add(elf);
			const [er, ec] = elf.split(',').map(Number);
			visualize(er, ec)
			await new Promise(r => setTimeout(r, 250));

			const neighbors = [];
			for (let dr = -1; dr <= 1; dr++) {
				for (let dc = -1; dc <= 1; dc++) {
					if (!(dr === 0 && dc === 0) && world.has(`${er + dr},${ec + dc}`)) {
						neighbors.push(`${er + dr},${ec + dc}`);
					}
				}
			}
			if (neighbors.length === 0) continue;

			const directionalNeighbors: Record<keyof typeof directionToOffset, (n: string) => boolean> = {
				north: n => +n.split(',')[0] < er, south: n => +n.split(',')[0] > er,
				west: n => +n.split(',')[1] < ec, east: n => +n.split(',')[1] > ec,
			}
			for (const direction of directions) {
				if (neighbors.filter(directionalNeighbors[direction]).length > 0) continue;

				const offset = directionToOffset[direction];
				const coordinate = [er + offset[0], ec + offset[1]];
				const otherElves = moves.get(coordinate.join(',')) || [];
				otherElves.push(elf);
				moves.set(coordinate.join(','), otherElves);
				world.set(elf, directionToChar[direction]);
				visualize()
				await new Promise(r => setTimeout(r, 250));
				break;
			}
		}

		await new Promise(r => setTimeout(r, 250));
		visualize();

		movedThisRound = 0;
		for (const [coord, [elf, other]] of moves.entries()) {
			if (other) continue;
			world.delete(elf);
			world.set(coord, 'O');
			await new Promise(r => setTimeout(r, 250));
			movedThisRound++;
			visualize();
		}
		moves.clear();
		processed.clear()

		directions.rotate();
		visualize();
		await new Promise(r => setTimeout(r, 250));
	}

	function visualize(er?: number, ec?: number) {
		const width = maxX - minX + 1;
		let lines: string[] = ['┌' + '─'.repeat(width) + '┐']
		let currentMinX = Infinity;
		let currentMaxX = -Infinity;
		let currentMinY = Infinity;
		let currentMaxY = -Infinity;
		for (const elf of world.keys()) {
			const [er, ec] = elf.split(',').map(Number);
			currentMinX = Math.min(currentMinX, ec);
			currentMaxX = Math.max(currentMaxX, ec);
			currentMinY = Math.min(currentMinY, er);
			currentMaxY = Math.max(currentMaxY, er);
		}
		let emptyWithin = 0
		for (let r = minY; r <= maxY; r++) {
			let line = '│';
			for (let c = minX; c <= maxX; c++) {
				if (r === er && c === ec) line += '?';
				else if (world.has(`${r},${c}`)) {
					let str = world.get(`${r},${c}`);
					if (processed.has(`${r},${c}`)) {
						// @ts-ignore
						if (str === 'O') str = str.red;
						// @ts-ignore
						else str = str.green;
						// @ts-ignore
					}
					line += str;
				} else {
					// if r and c are within current bounds
					if (r >= currentMinY && r <= currentMaxY && c >= currentMinX && c <= currentMaxX) emptyWithin++
					if (moves.has(`${r},${c}`)) {
						// @ts-ignore
						line += '·'.magenta;
					} else {
						line += '·';
					}
				}
			}
			lines.push(line + '│');
		}
		lines.push('└' + '─'.repeat(width) + '┘');
		lines.push(`P1: ${emptyWithin} R: ${r} Moved: ${movedThisRound}`)
		console.clear();
		console.log(lines.join('\n'));
	}
}

doTheThing(`..............
..............
.......#......
.....###.#....
...#...#.#....
....#...##....
...#.###......
...##.#.##....
....#..#......
..............
..............
..............`);


//const data = fs.readFileSync(__dirname + '/input.in').toString();
//doTheThing(data);