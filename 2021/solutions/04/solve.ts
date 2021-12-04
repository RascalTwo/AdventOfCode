const fs = require('fs');
const assert = require('assert');

class Board {
	rows: { number: number, marked?: true }[][];
	constructor(raw: string) {
		this.rows = raw.split('\n').map(row => row.split(' ').filter(Boolean).map(Number).map(number => ({ number })));
	}

	mark(marking: number) {
		for (const row of this.rows) {
			for (const cell of row) {
				if (cell.number === marking) cell.marked = true;
			}
		}

		return this.won
	}

	get won(): boolean {
		if (this.rows.some(row => row.every(({ marked }) => marked))) return true;
		if (new Array(this.rows.length).fill(undefined).some((_, c) => new Array(this.rows.length).fill(undefined).every((_, r) => this.rows[r][c].marked))) return true;
		return false;
	}

	get score(): number {
		return this.rows.flatMap(row => row.filter(({ marked }) => !marked).map(({ number }) => number)).reduce((sum, number) => sum + number);
	}
}

function solveOne(data: string): number | null {
	const boards = data.trim().split('\n\n').slice(1).map(raw => new Board(raw));
	for (const number of data.trim().split('\n')[0].split(',').map(Number)) {
		for (const board of boards) {
			if (board.mark(number)) return board.score * number;
		}
	}

	return null;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`), 4512);
	console.log(solveOne(data));
})()


function solveTwo(data: string): number | null {
	const boards = data.trim().split('\n\n').slice(1).map(raw => new Board(raw));
	for (const number of data.trim().split('\n')[0].split(',').map(Number)) {
		for (let b = boards.length - 1; b >= 0; b--) {
			const board = boards[b];
			if (!board.mark(number)) continue;
			boards.splice(b, 1);
			if (!boards.length) return board.score * number;
		}
	}

	return null;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`), 1924);
	console.log(solveTwo(data));
})();
