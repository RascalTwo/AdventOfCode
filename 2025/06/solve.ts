const fs = require("fs");
const assert = require("assert");

function calculateColumnWidths(operators: string) {
	const columnWidths = [];
	let currentWidth = 0;
	for (const characters of operators.slice(1) + " !") {
		if (characters === " ") {
			currentWidth++;
		} else {
			columnWidths.push(currentWidth);
			currentWidth = 0;
		}
	}
	return columnWidths;
}

function parseProblems(data: string) {
	const rawLines = data.split("\n")
	return rawLines.map(
		(line) =>
			calculateColumnWidths(rawLines.at(-1)!).reduce(
				({ columns, widthsSoFar }, width) => ({
					columns: [...columns, line.slice(widthsSoFar, widthsSoFar + width)],
					widthsSoFar: widthsSoFar + width + 1,
				}),
				{
					columns: [] as string[],
					widthsSoFar: 0,
				}
			).columns
	);
}

function solve(
	data: string,
	generateNumbersAndOperator: (column: number, lines: string[][]) => string[]
) {
	const lines = parseProblems(data);
	let total = 0;
	for (let c = 0; c < lines[0].length; c++) {
		const column = generateNumbersAndOperator(c, lines);
		const operator = column.splice(-1)[0];
		total += eval(column.join(" " + operator + " "));
	}
	return total;
}

function solveOne(data: string) {
	return solve(data, (c, lines) => lines.map((row) => row[c]));
}

(() => {
	const data = fs.readFileSync(__dirname + "/input.in").toString();
	assert.deepStrictEqual(solveOne(`123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `), 4277556);
	console.log(solveOne(data));
})();

function solveTwo(data: string): any {
	return solve(data, (c, lines) => {
		const columns = lines.map((row) => row[c])
		const numbers = [];
		for (let c = columns[0].length - 1; c >= 0; c--) {
			numbers.push(columns.slice(0, -1).map(row => row[c]).join('').trim())
		}
		return [...numbers, columns.at(-1)!];
	});
}

(() => {
	const data = fs.readFileSync(__dirname + "/input.in").toString();
	assert.deepStrictEqual(solveTwo(`123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `), 3263827);
	console.log(solveTwo(data));
})();

export { };
