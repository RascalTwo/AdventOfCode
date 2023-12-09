// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');


function extrapolateNewColumn(rows: number[][], direction: 'future' | 'past') {
	const colIndex = direction === 'future' ? -1 : 0;
	const changeSign = direction === 'future' ? 1 : -1
	const rowMethod = direction === 'future' ? 'push' : 'unshift'

	rows.at(-1)!.push(0);
	for (let i = rows.length - 2; i >= 0; i--) {
		const row = rows[i]
		const current = row.at(colIndex)!;
		const change = rows[i + 1].at(colIndex)! * changeSign
		row[rowMethod](current + change)
	}
	return rows
}

function generateDifferenceRows(line: string) {
	const rows = [
		line.split(' ').map(Number)
	]
	for (let lastRow = rows[0]; rows.at(-1)!.some(n => n !== 0); lastRow = rows.at(-1)!) {
		const nextRow = [];
		for (let i = 0; i < lastRow.length - 1; i++) {
			nextRow.push(lastRow[i + 1] - lastRow[i])
		}
		rows.push(nextRow)
	}
	return rows;
}

function solve(data: string, direction: 'future' | 'past') {
	return data.trim().split('\n').reduce((total, line) => {
		const rows = generateDifferenceRows(line);
		extrapolateNewColumn(rows, direction);
		return total + rows[0].at(direction === 'future' ? -1 : 0)!
	}, 0);
}

function solveOne(data: string): any {
	return solve(data, 'future')
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(extrapolateNewColumn([[0, 3, 6, 9, 12, 15], [3, 3, 3, 3, 3], [0, 0, 0, 0]], 'future'), [[0, 3, 6, 9, 12, 15, 18], [3, 3, 3, 3, 3, 3], [0, 0, 0, 0, 0]])
	assert.deepStrictEqual(extrapolateNewColumn([
		[1, 3, 6, 10, 15, 21],
		[2, 3, 4, 5, 6],
		[1, 1, 1, 1],
		[0, 0, 0]
	], 'future'), [
		[1, 3, 6, 10, 15, 21, 28],
		[2, 3, 4, 5, 6, 7],
		[1, 1, 1, 1, 1],
		[0, 0, 0, 0]
	])
	assert.deepStrictEqual(extrapolateNewColumn([
		[10, 13, 16, 21, 30, 45],
		[3, 3, 5, 9, 15],
		[0, 2, 4, 6],
		[2, 2, 2],
		[0, 0]
	], 'future'), [
		[10, 13, 16, 21, 30, 45, 68],
		[3, 3, 5, 9, 15, 23],
		[0, 2, 4, 6, 8],
		[2, 2, 2, 2],
		[0, 0, 0]
	])
	assert.deepStrictEqual(solveOne(`0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`), 114);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	return solve(data, 'past')
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(extrapolateNewColumn([
		[10, 13, 16, 21, 30, 45],
		[3, 3, 5, 9, 15],
		[0, 2, 4, 6],
		[2, 2, 2],
		[0, 0]
	], 'past'), [
		[5, 10, 13, 16, 21, 30, 45],
		[5, 3, 3, 5, 9, 15],
		[-2, 0, 2, 4, 6],
		[2, 2, 2, 2],
		[0, 0, 0]
	])
	assert.deepStrictEqual(solveTwo(`0 3 6 9 12 15
	1 3 6 10 15 21
	10 13 16 21 30 45`), 2);
	console.log(solveTwo(data));
})();
