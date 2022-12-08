const fs = require('fs');
const assert = require('assert');


const DIRECTIONS = [[-1, 0], [1, 0], [0, 1], [0, -1]] as [number, number][];

const parseMatrix = (data: string) => data.trim().split('\n').map(row => [...row]);

function isVisibleViaDirection(r: number, c: number, matrix: string[][], [vr, vc]: [number, number]): boolean {
	for (let cr = r + vr, cc = c + vc; cr >= 0 && cr < matrix.length && cc >= 0 && cc < matrix[0].length; cr += vr, cc += vc) {
		if (matrix[cr][cc] >= matrix[r][c]) return false;
	}
	return true;
}


function* traverseInnerIndexes(matrix: string[][]) {
	for (let r = 1; r < matrix.length - 1; r++) {
		for (let c = 1; c < matrix[r].length - 1; c++) {
			yield [r, c];
		}
	}
}

function solveOne(data: string): any {
	const matrix = parseMatrix(data);

	return [...traverseInnerIndexes(matrix)]
		.reduce(
			(visible, [r, c]) => visible + +DIRECTIONS.some(dir => isVisibleViaDirection(r, c, matrix, dir)),
			matrix.length * 2 + matrix[0].length * 2 - 4
		);
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


function calculateScenicScoreInDirection(r: number, c: number, matrix: string[][], [vr, vc]: [number, number]): number {
	let score = 0;
	for (let cr = r + vr, cc = c + vc; cr >= 0 && cr < matrix.length && cc >= 0 && cc < matrix[0].length; cr += vr, cc += vc) {
		score++;
		if (matrix[cr][cc] >= matrix[r][c]) break;
	}
	return score;
}

function solveTwo(data: string): any {
	const matrix = parseMatrix(data);

	return [...traverseInnerIndexes(matrix)]
		.reduce(
			(best, [r, c]) => Math.max(best, DIRECTIONS.reduce((a, dir) => a * calculateScenicScoreInDirection(r, c, matrix, dir), 1)),
			-Infinity
		);
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
