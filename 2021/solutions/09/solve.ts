const fs = require('fs');
const assert = require('assert');



class Matrix {
	rows: number[][];

	constructor(data: string) {
		this.rows = [...data.trim().split('\n')].map(row => [...row].map(Number))
	}

	* neighborsOf(r: number, c: number): Iterable<[[number, number], number | undefined]> {
		for (const [ro, co] of [[0, 1], [0, -1], [-1, 0], [1, 0]]) {
			const [nr, nc] = [r + ro, c + co];
			yield [[nr, nc], this.rows[nr]?.[nc]]
		}
	}

	isLow(r: number, c: number) {
		const value = this.rows[r][c];
		for (const [_, neighborValue] of this.neighborsOf(r, c)) {
			if (value >= (neighborValue ?? value + 1)) return false;
		}
		return true;
	}

	floodBasin(basin: [number, number][]) {
		const [r, c] = basin[basin.length - 1];

		for (const [[nr, nc], neighborValue] of this.neighborsOf(r, c)) {
			if ((neighborValue ?? 9) < 9 && !basin.find(([lr, lc]) => lr === nr && lc === nc)) {
				basin.push([nr, nc]);
				this.floodBasin(basin);
			}
		}

		return basin.length;
	}
}

function solveOne(data: string): number {
	const matrix = new Matrix(data);

	let result = 0
	for (const [r, row] of matrix.rows.entries()) {
		for (const [c, value] of row.entries()) {
			if (matrix.isLow(r, c)) result += value + 1
		}
	}
	return result;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`2199943210
3987894921
9856789892
8767896789
9899965678`), 15);
	console.log(solveOne(data));
})();


function solveTwo(data: string): number {
	const matrix = new Matrix(data);

	const values = [];
	for (const [r, row] of matrix.rows.entries()) {
		for (let c = 0; c < row.length; c++) {
			if (matrix.isLow(r, c)) values.push(matrix.floodBasin([[r, c]]))
		}
	}
	return values.sort((a, b) => a - b).slice(-3).reduce((total, value) => total * value);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`2199943210
3987894921
9856789892
8767896789
9899965678`), 1134);
	console.log(solveTwo(data));
})();
