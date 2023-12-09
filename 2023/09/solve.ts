// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');


function addNewColToRows(rows: number[][]) {
	rows.at(-1)!.push(0);
	for (let i = rows.length - 2; i >= 0; i--) {
		const row = rows[i]
		const current = row.at(-1)!;
		const change = rows[i + 1].at(-1)!
		row.push(current + change)
	}
	return rows
}

function addNewColToRowsRevere(rows: number[][]) {
	rows.at(-1)!.push(0);
	for (let i = rows.length - 2; i >= 0; i--) {
		const row = rows[i]
		const current = row.at(0)!;
		const change = -rows[i + 1].at(0)!
		row.unshift(current + change)
	}
	return rows
}

function solveOne(data: string): any {
	let total = 0
	for (const line of data.trim().split('\n')) {
		const rows = [
			line.split(' ').map(Number)
		]
		while (rows.at(-1)!.reduce((a, b) => a + b, 0) !== 0) {
			const nextRow = [];
			const lastRow = rows.at(-1)!;
			for (let i = 0; i < lastRow.length - 1; i++) {
				nextRow.push(lastRow[i + 1] - lastRow[i])
			}
			rows.push(nextRow)
		}
		addNewColToRows(rows)
		total += rows[0].at(-1)!
	}
	return total
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(addNewColToRows([[0, 3, 6, 9, 12, 15], [3, 3, 3, 3, 3], [0, 0, 0, 0]]), [[0, 3, 6, 9, 12, 15, 18], [3, 3, 3, 3, 3, 3], [0, 0, 0, 0, 0]])
	assert.deepStrictEqual(addNewColToRows([
		[1, 3, 6, 10, 15, 21],
		[2, 3, 4, 5, 6],
		[1, 1, 1, 1],
		[0, 0, 0]
	]), [
		[1, 3, 6, 10, 15, 21, 28],
		[2, 3, 4, 5, 6, 7],
		[1, 1, 1, 1, 1],
		[0, 0, 0, 0]
	])
	assert.deepStrictEqual(addNewColToRows([
		[10, 13, 16, 21, 30, 45],
		[3, 3, 5, 9, 15],
		[0, 2, 4, 6],
		[2, 2, 2],
		[0, 0]
	]), [
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
	let total = 0
	for (const line of data.trim().split('\n')) {
		const rows = [
			line.split(' ').map(Number)
		]
		while (rows.at(-1)!.reduce((a, b) => a + b, 0) !== 0) {
			const nextRow = [];
			const lastRow = rows.at(-1)!;
			for (let i = 0; i < lastRow.length - 1; i++) {
				nextRow.push(lastRow[i + 1] - lastRow[i])
			}
			rows.push(nextRow)
		}
		addNewColToRowsRevere(rows)
		total += rows[0][0]
	}
	return total
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(addNewColToRowsRevere([
		[10, 13, 16, 21, 30, 45],
		[3, 3, 5, 9, 15],
		[0, 2, 4, 6],
		[2, 2, 2],
		[0, 0]
	]), [
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
