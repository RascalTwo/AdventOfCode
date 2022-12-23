const fs = require('fs');
const assert = require('assert');



const rotatableArray = (arr: any[]) => {
	return {
		start: 0,
		rotate() {
			this.start++;
			if (this.start >= arr.length) this.start = 0;
		},
		values() {
			const result = [];
			for (let i = 0; i < arr.length; i++) {
				result.push(arr[(this.start + i) % arr.length]);
			}
			return result;
		}
	}
}

function solveOne(data: string): any {
	const directions = rotatableArray(['north', 'south', 'west', 'east'])

	const world = new Set<string>();
	for (const [r, row] of data.split('\n').entries()) {
		for (const [c, col] of row.split('').entries()) {
			if (col === '#') {
				world.add(`${r},${c}`);
			}
		}
	}

	const wantedMoves = new Map<string, string[]>();
	for (let r = 0; r < 10; r++) {
		wantedMoves.clear()
		//visualize()
		for (const elf of world) {
			const [er, ec] = elf.split(',').map(Number);
			const neighbors = [];
			for (let dr = -1; dr <= 1; dr++) {
				for (let dc = -1; dc <= 1; dc++) {
					if (dr === 0 && dc === 0) continue;
					if (world.has(`${er + dr},${ec + dc}`)) {
						neighbors.push(`${er + dr},${ec + dc}`);
					}
				}
			}



			//visualize(er, ec)

			if (neighbors.length === 0) continue;
			const northNeighbors = neighbors.filter(n => +n.split(',')[0] < er);
			const southNeighbors = neighbors.filter(n => +n.split(',')[0] > er);
			const westNeighbors = neighbors.filter(n => +n.split(',')[1] < ec);
			const eastNeighbors = neighbors.filter(n => +n.split(',')[1] > ec);
			for (const direction of directions.values()) {
				if (direction === 'north' && northNeighbors.length === 0) {
					const northCoordinate = [er - 1, ec];
					const desiringCoord = wantedMoves.get(northCoordinate.join(',')) || [];
					desiringCoord.push(elf);
					wantedMoves.set(northCoordinate.join(','), desiringCoord);
					break;
				}
				if (direction === 'south' && southNeighbors.length === 0) {
					const southCoordinate = [er + 1, ec];
					const desiringCoord = wantedMoves.get(southCoordinate.join(',')) || [];
					desiringCoord.push(elf);
					wantedMoves.set(southCoordinate.join(','), desiringCoord);
					break;
				}
				if (direction === 'west' && westNeighbors.length === 0) {
					const westCoordinate = [er, ec - 1];
					const desiringCoord = wantedMoves.get(westCoordinate.join(',')) || [];
					desiringCoord.push(elf);
					wantedMoves.set(westCoordinate.join(','), desiringCoord);
					break;
				}
				if (direction === 'east' && eastNeighbors.length === 0) {
					const eastCoordinate = [er, ec + 1];
					const desiringCoord = wantedMoves.get(eastCoordinate.join(',')) || [];
					desiringCoord.push(elf);
					wantedMoves.set(eastCoordinate.join(','), desiringCoord);
					break;
				}
			}
		}

		for (const [coord, elves] of wantedMoves.entries()) {
			if (elves.length > 1) continue;
			const [r, c] = coord.split(',').map(Number);
			const elf = elves[0];
			world.delete(elf);
			world.add(`${r},${c}`);
		}
		directions.rotate();

		//visualize()
	}


	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;
	for (const elf of world) {
		const [r, c] = elf.split(',').map(Number);
		minX = Math.min(minX, c);
		maxX = Math.max(maxX, c);
		minY = Math.min(minY, r);
		maxY = Math.max(maxY, r);
	}

	function visualize(er?: number, ec?: number) {
		let minX = Infinity;
		let maxX = -Infinity;
		let minY = Infinity;
		let maxY = -Infinity;
		for (const elf of world) {
			const [r, c] = elf.split(',').map(Number);
			minX = Math.min(minX, c);
			maxX = Math.max(maxX, c);
			minY = Math.min(minY, r);
			maxY = Math.max(maxY, r);
		}

		let lines: string[] = ['---------------------']
		for (let r = minY; r <= maxY; r++) {
			let line = '';
			for (let c = minX; c <= maxX; c++) {
				if (r === er && c === ec) line += 'E';
				else if (world.has(`${r},${c}`)) {
					line += '#';
				} else {
					line += '.';
				}
			}
			lines.push(line);
		}
		console.log(lines.join('\n'));
	}

	let result = 0;
	for (let r = minY; r <= maxY; r++) {
		for (let c = minX; c <= maxX; c++) {
			if (!world.has(`${r},${c}`)) {
				result++;
			}
		}
	}

	visualize()
	return result;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`..............
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
..............`), 110);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	
	const directions = rotatableArray(['north', 'south', 'west', 'east'])

	const world = new Set<string>();
	for (const [r, row] of data.split('\n').entries()) {
		for (const [c, col] of row.split('').entries()) {
			if (col === '#') {
				world.add(`${r},${c}`);
			}
		}
	}

	const wantedMoves = new Map<string, string[]>();
	for (let r = 0; r < 1_000_000; r++) {
		wantedMoves.clear()
		//visualize()
		for (const elf of world) {
			const [er, ec] = elf.split(',').map(Number);
			const neighbors = [];
			for (let dr = -1; dr <= 1; dr++) {
				for (let dc = -1; dc <= 1; dc++) {
					if (dr === 0 && dc === 0) continue;
					if (world.has(`${er + dr},${ec + dc}`)) {
						neighbors.push(`${er + dr},${ec + dc}`);
					}
				}
			}



			//visualize(er, ec)

			if (neighbors.length === 0) continue;
			const northNeighbors = neighbors.filter(n => +n.split(',')[0] < er);
			const southNeighbors = neighbors.filter(n => +n.split(',')[0] > er);
			const westNeighbors = neighbors.filter(n => +n.split(',')[1] < ec);
			const eastNeighbors = neighbors.filter(n => +n.split(',')[1] > ec);
			for (const direction of directions.values()) {
				if (direction === 'north' && northNeighbors.length === 0) {
					const northCoordinate = [er - 1, ec];
					const desiringCoord = wantedMoves.get(northCoordinate.join(',')) || [];
					desiringCoord.push(elf);
					wantedMoves.set(northCoordinate.join(','), desiringCoord);
					break;
				}
				if (direction === 'south' && southNeighbors.length === 0) {
					const southCoordinate = [er + 1, ec];
					const desiringCoord = wantedMoves.get(southCoordinate.join(',')) || [];
					desiringCoord.push(elf);
					wantedMoves.set(southCoordinate.join(','), desiringCoord);
					break;
				}
				if (direction === 'west' && westNeighbors.length === 0) {
					const westCoordinate = [er, ec - 1];
					const desiringCoord = wantedMoves.get(westCoordinate.join(',')) || [];
					desiringCoord.push(elf);
					wantedMoves.set(westCoordinate.join(','), desiringCoord);
					break;
				}
				if (direction === 'east' && eastNeighbors.length === 0) {
					const eastCoordinate = [er, ec + 1];
					const desiringCoord = wantedMoves.get(eastCoordinate.join(',')) || [];
					desiringCoord.push(elf);
					wantedMoves.set(eastCoordinate.join(','), desiringCoord);
					break;
				}
			}
		}

		let movesMade = 0;
		for (const [coord, elves] of wantedMoves.entries()) {
			if (elves.length > 1) continue;
			const [r, c] = coord.split(',').map(Number);
			const elf = elves[0];
			world.delete(elf);
			world.add(`${r},${c}`);
			movesMade++
		}
		if (movesMade === 0) return r + 1;
		directions.rotate();

		//visualize()
	}


	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;
	for (const elf of world) {
		const [r, c] = elf.split(',').map(Number);
		minX = Math.min(minX, c);
		maxX = Math.max(maxX, c);
		minY = Math.min(minY, r);
		maxY = Math.max(maxY, r);
	}

	function visualize(er?: number, ec?: number) {
		let minX = Infinity;
		let maxX = -Infinity;
		let minY = Infinity;
		let maxY = -Infinity;
		for (const elf of world) {
			const [r, c] = elf.split(',').map(Number);
			minX = Math.min(minX, c);
			maxX = Math.max(maxX, c);
			minY = Math.min(minY, r);
			maxY = Math.max(maxY, r);
		}

		let lines: string[] = ['---------------------']
		for (let r = minY; r <= maxY; r++) {
			let line = '';
			for (let c = minX; c <= maxX; c++) {
				if (r === er && c === ec) line += 'E';
				else if (world.has(`${r},${c}`)) {
					line += '#';
				} else {
					line += '.';
				}
			}
			lines.push(line);
		}
		console.log(lines.join('\n'));
	}

	let result = 0;
	for (let r = minY; r <= maxY; r++) {
		for (let c = minX; c <= maxX; c++) {
			if (!world.has(`${r},${c}`)) {
				result++;
			}
		}
	}

	visualize()
	return result;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`..............
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
	..............`), 20);
	console.log(solveTwo(data));
})();
