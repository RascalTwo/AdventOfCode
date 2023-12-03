// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');

type PartNumber = Record<'r' | 'c' | 'value', number>;


const coordsToInt = (x: number, y: number, maxX: number) => x * maxX + y

const collectWholeNumber = (world: string[][], r: number, startCol: number) => {
	let partNumber = '';

	let c = startCol;
	while (/\d/.test(world[r][c])) {
		partNumber += world[r][c]
		c--;
	}
	c++;
	const wholeNumberStartCol = c;

	c += partNumber.length
	partNumber = [...partNumber].reverse().join('')
	while (/\d/.test(world[r][c])) {
		partNumber += world[r][c]
		c++;
	}
	return { r, c: wholeNumberStartCol, value: +partNumber }
}


const collectPartNumbers = (data: string, symbols: string) => {
	const world = data.trim().split('\n').map(line => line.split(''));

	const symbolPartNumbers = new Map<number, PartNumber[]>()
	for (const [r, row] of world.entries()) {
		for (const [c, char] of row.entries()) {
			if (!symbols.includes(char)) continue;

			const foundPartNumbers = new Map<number, PartNumber>();
			for (const newRow of [-1, 0, 1].map(o => r + o)) {
				for (const newCol of [-1, 0, 1].map(o => c + o)) {
					if (r === newRow && c === newCol) continue

					const newChar = world[newRow]?.[newCol];
					if (newChar < '0' || newChar > '9') continue;

					const partNumber = collectWholeNumber(world, newRow, newCol)
					foundPartNumbers.set(coordsToInt(partNumber.r, partNumber.c, world.length), partNumber);
				}
			}
			if (foundPartNumbers.size) symbolPartNumbers.set(coordsToInt(r, c, world.length), [...foundPartNumbers.values()]);
		}
	}

	return [...symbolPartNumbers.values()]
}


function solveOne(data: string): any {
	return collectPartNumbers(data, '*/=+%@#&-$')
		.flatMap(partNumbers => partNumbers.map(partNumber => partNumber.value))
		.reduce((a, b) => a + b, 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`), 4361);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	return collectPartNumbers(data, '*')
		.reduce((a, b) => a + (b.length == 2 ? b.reduce((a, b) => a * b.value, 1) : 0), 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`), 467835);
	console.log(solveTwo(data));
})();
