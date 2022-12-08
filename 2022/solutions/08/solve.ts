const fs = require('fs');
const assert = require('assert');



function isVisible(r: number, c: number, matrix: string[][]): boolean {
	for (const dir of [[-1, 0], [1, 0], [0, 1], [0, -1]]){
		let current = [r, c];
		let vis = true
		while (true){
			current = [current[0] + dir[0], current[1] + dir[1]];
			if (!(current[0] >= 0 && current[0] < matrix.length && current[1] >= 0 && current[1] < matrix[0].length)) {
				break;
			}
			// if value is larger then r, c then break
			const value = matrix[current[0]][current[1]];
			if (value >= matrix[r][c]) {
				vis = false;
				break;
			}
		}
		if (vis) return vis
	}
	return false;
}

function solveOne(data: string): any{
	const matrix = data.trim().split('\n').map(row => row.split(''));
	const edges = new Set();
	for (let r = 0; r < matrix.length; r++) {
		for (let c = 0; c < matrix[r].length; c++) {
			if (r === 0 || c === 0 || r === matrix.length - 1 || c === matrix[0].length - 1) edges.add(`${r},${c}`);
		}
	}

	let visble = edges.size;
	for (let r = 1; r < matrix.length - 1; r++) {
		for (let c = 1; c < matrix[r].length - 1; c++) {
			if (isVisible(r, c, matrix)) {
				visble++
			}
		}
	}

	return visble;
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`
30373
25512
65332
33549
35390
`), 21);
	console.log(solveOne(data));
})();


function calcScenic(r: number, c: number, matrix: string[][]) {
	let sums = [];
	for (const dir of [[-1, 0], [1, 0], [0, 1], [0, -1]]){
		let score = 0;

		let current = [r, c];
		while (true){
			current = [current[0] + dir[0], current[1] + dir[1]];

			if (!(current[0] >= 0 && current[0] < matrix.length && current[1] >= 0 && current[1] < matrix[0].length)) {
				break;
			}
			// if value is larger then r, c then break
			score++
			const value = matrix[current[0]][current[1]];
			if (value >= matrix[r][c]) {
				break;
			}
		}
		sums.push(score)

	}
	return sums.reduce((a, b) => a * b, 1);
}

function solveTwo(data: string): any{
	const matrix = data.trim().split('\n').map(row => row.split(''));

	let best = -Infinity
	for (let r = 1; r < matrix.length - 1; r++) {
		for (let c = 1; c < matrix[r].length - 1; c++) {
			const s = calcScenic(r, c, matrix);
			if (s > best) best = s
		}
	}

	return best;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`
30373
25512
65332
33549
35390
`), 8);
	console.log(solveTwo(data));
})();
