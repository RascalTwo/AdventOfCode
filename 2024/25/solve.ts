const fs = require('fs');
const assert = require('assert');

function parseSchematics(data: string) {
	const locks: number[][] = []
	const keys: number[][] = []
	for (const schematic of data.replace(/\r/g, '').split('\n\n')) {
		const lines = schematic.split('\n')

		const heights = []
		for (let c = 0; c < lines[0].length; c++) {
			let height = 0
			for (let r = 0; r < lines.length; r++) {
				if (lines[r][c] == '#') height++
			}
			heights.push(height - 1)
		}

		(lines[0] === '#'.repeat(lines[0].length) ? locks : keys).push(heights);
	}

	return { locks, keys }
}

function canFitTogether(lock: number[], key: number[]) {
	for (let c = 0; c < lock.length; c++) {
		if (lock[c] + key[c] >= 6) {
			return false
		}
	}
	return true;
}

function solveOne(data: string): any {
	const { locks, keys } = parseSchematics(data)

	let canFit = 0
	for (const lock of locks) {
		for (const key of keys) {
			if (canFitTogether(lock, key)) {
				canFit++
			}
		}
	}
	return canFit;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`
#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`.trim()), 3);
	console.log(solveOne(data));
})();

export { }