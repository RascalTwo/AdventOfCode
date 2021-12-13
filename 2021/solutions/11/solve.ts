const fs = require('fs');
const assert = require('assert');


function flash(matrix: number[][], flashed: Set<string>, [r, c]: [number, number]) {
	flashed.add(JSON.stringify([r, c]));
	matrix[r][c] = -1;

	for (let ro = -1; ro <= 1; ro++) {
		for (let co = -1; co <= 1; co++) {
			if (!ro && !co) continue;

			const [nr, nc] = [r + ro, c + co];
			if (matrix[nr]?.[nc] === undefined) continue;

			matrix[nr][nc]++;
			if (matrix[nr][nc] > 9) flash(matrix, flashed, [nr, nc]);
		}
	}
}


function solve(data: string, mode: (1 | 2)): number {
	const matrix: number[][] = [];
	for (const row of data.trim().split('\n')) matrix.push([...row].map(Number));


	const endStep = mode === 1 ? 101 : Number.MAX_SAFE_INTEGER;

	let flashTotal = 0;
	for (let step = 1; step < endStep; step++) {
		for (const row of matrix) {
			for (let c = 0; c < row.length; c++) {
				row[c]++;
			}
		}

		const flashed = new Set<string>();
		for (const [r, row] of matrix.entries()) {
			for (const [c, value] of row.entries()) {
				if (value > 9) flash(matrix, flashed, [r, c]);
			}
		}

		for (const [r, c] of [...flashed].map(rawLoc => JSON.parse(rawLoc))) {
			matrix[r][c] = 0;
		}


		if (mode === 1) flashTotal += flashed.size;
		else if (flashed.size === matrix.length * matrix[0].length) return step;
	}
	return flashTotal;
}

function solveOne(data: string): number {
	return solve(data, 1);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`), 1656);
	console.log(solveOne(data));
})();


function solveTwo(data: string): number {
	return solve(data, 2);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`), 195);
	console.log(solveTwo(data));
})();
