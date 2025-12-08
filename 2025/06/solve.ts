const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	const things = data.split('\n').map(line => line.trim().split(/\s+/))
	let total = 0
	for (let c = 0; c < things[0].length; c++) {
		const row = [];
		for (let r = 0; r < things.length; r++) {
			row.push(things[r][c])
		}
		const op = row.splice(-1)[0]
		const expr = row.join(op)
		const res = eval(expr)
		total += res
	}
	return total
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `), 4277556);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	//const things = data.split('\n').map(line => line.trim().split(/\s+/))
	let colWidths = [];
	const ops = data.split('\n').at(-1)!
	let currWidth = 0
	for (let i = 0; i < ops.length; i++) {
		if (ops[i] === ' ') currWidth++
		else {
			colWidths.push(currWidth)
			currWidth = 0
		}
	}
	if (currWidth) colWidths.push(currWidth + 1)
	colWidths.splice(0, 1);
	const newThings = [];
	for (let line of data.split('\n')) {
		const chars = line.split('')
		const cols = [];
		for (let width of colWidths) {
			cols.push(chars.splice(0, width).join(''))
			chars.splice(0, 1)
		}
		newThings.push(cols)
	}
	let total = 0
	for (let c = 0; c < newThings[0].length; c++) {
		const row = [];
		for (let r = 0; r < newThings.length; r++) {
			row.push(newThings[r][c])
		}
		const op = row.splice(-1)[0]
		const longestOfRow = row.reduce((a, b) => a.length > b.length ? a : b, '').length
		//const paddedRow = row.map(s => s.padStart(longestOfRow, ' '))
		//paddedRow
		const nums = []
		for (let rc = row[0].length - 1; rc >= 0; rc--) {
			let newNum = ''
			for (let rr = 0; rr < row.length; rr++) {
				newNum += row[rr][rc]
			}
			nums.push(newNum.trim())
		}
		const expr = nums.join(op)
		expr
		const res = eval(expr)
		total += res
	}
	return total
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `), 3263827);
	console.log(solveTwo(data));
})();

export { }