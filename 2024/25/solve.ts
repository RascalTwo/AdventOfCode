const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	const schematics = data.replace(/\r/g, '').split('\n\n').map(schem => {
		const lines = schem.split('\n')
		const type = lines[0] === '#'.repeat(lines[0].length) ? 'lock' : 'key';
		const heights = []
		for (let c = 0; c < lines[0].length; c++) {
			let height = -1
			for (let r = 0; r < lines.length; r++) {
				if (lines[r][c] == '#') height++
			}
			heights.push(height)
		}
		return { type, heights }
	})
	const locks = schematics.filter(s => s.type === 'lock')
	const keys = schematics.filter(s => s.type === 'key')
	let canFit = 0
	for (const lock of locks) {
		for (const key of keys) {
			let overlap = false
			for (let i = 0; i < key.heights.length; i++) {
				if (key.heights[i] + lock.heights[i] >= 6) {
					overlap = true
				}
			}
			if (!overlap) {
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


function solveTwo(data: string): any {
	return true;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(``), true);
	console.log(solveTwo(data));
})();

export { }