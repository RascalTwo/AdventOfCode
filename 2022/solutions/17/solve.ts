const fs = require('fs');
const assert = require('assert');


const circularArray = (arr: any[]) => {
	return {
		index: 0,
		next() {
			const item = arr[this.index];
			this.index++;
			if (this.index >= arr.length) this.index = 0;
			return item;
		}
	}
}

function solve(data: string, desiredRocks: number) {
	const rocks = circularArray([
		[
			['#', '#', '#', '#']
		],
		[
			['', '#', ''],
			['#', '#', '#'],
			['', '#', ''],
		],
		[
			['', '', '#'],
			['', '', '#'],
			['#', '#', '#'],
		],
		[
			['#'],
			['#'],
			['#'],
			['#'],
		],
		[
			['#', '#'],
			['#', '#'],
		],
	])
	const jets = circularArray(data.split(''));

	const world = new Set<string>();
	const getHeight = () => {
		let height = 0;
		for (const key of world) height = Math.max(height, parseInt(key))
		return height + 1;
	}

	const patterns = new Map();
	let additionalHeight = 0;
	for (let rocksPlaced = 0; rocksPlaced < desiredRocks; rocksPlaced++) {
		const shape = rocks.next()
		const rock = {
			shape,
			r: getHeight() + (rocksPlaced ? 3 : 2) + shape.length - 1,
			c: 2,
			generateCoordinates() {
				const coordinates = [];
				for (const [ro, row] of this.shape.entries()) {
					for (const [co, char] of row.entries()) {
						if (char) coordinates.push([this.r - ro, this.c + co])
					}
				}
				return coordinates;
			}
		}
		while (true) {
			const jet = jets.next();
			const coordinates = rock.generateCoordinates()
			if (
				jet === '<'
				&& rock.c
				&& coordinates.every(([r, c]) => !world.has(`${r},${c - 1}`))
			) rock.c--;
			else if (
				jet === '>'
				&& rock.c + rock.shape[0].length < 7
				&& coordinates.every(([r, c]) => !world.has(`${r},${c + 1}`))
			) rock.c++;

			if (rock.generateCoordinates().some(([r, c]) => r - 1 < 0 || world.has(`${r - 1},${c}`))) break
			else rock.r--;
		}

		for (const [rr, row] of rock.shape.entries()) {
			for (const [cc, char] of row.entries()) {
				if (char) world.add(`${rock.r - rr},${rock.c + cc}`);
			}
		}

		const height = getHeight()
		let patternKey = `${jets.index}|${rocks.index}`;
		for (let r = height; r >= height - 5; r--) {
			let row = '';
			for (let c = 0; c < 7; c++) row += world.has(`${r},${c}`) ? '#' : '.';
			patternKey += `|${row}`;
		}
		if (patterns.has(patternKey)) {
			const previous = patterns.get(patternKey);
			const rocksChanges = rocksPlaced - previous.rocksPlaced;
			const highestPointChanges = height - previous.height;
			const cycles = Math.floor((desiredRocks - previous.rocksPlaced) / rocksChanges) - 1;
			additionalHeight += cycles * highestPointChanges;
			rocksPlaced += cycles * rocksChanges;
		}
		else patterns.set(patternKey, { rocksPlaced, height });
	}

	return additionalHeight + getHeight();
}


function solveOne(data: string) {
	return solve(data, 2022);
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne('>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>'), 3068)
	console.log(solveOne(data));
})();

function solveTwo(data: string): any {
	return solve(data, 1_000_000_000_000)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo('>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>'), 1514285714288);
	console.log(solveTwo(data));
})();
