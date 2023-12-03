// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');


function solveOne(data: string): any {
	const world = data.trim().split('\n').map(line => line.split(''));

	const digitsFound = [];
	for (let r = 0; r < world.length; r++) {
		const row = world[r];
		for (let c = 0; c < row.length; c++) {
			const char = row[c];
			if (char !== '.' && !/\d/.test(char)) {
				const neighbors = [];
				for (const ro of [-1, 0, 1]) {
					const nr = r + ro;
					for (const co of [-1, 0, 1]) {
						if (!ro && !co) continue
						const nc = c + co;
						const newChar = world[nr]?.[nc];
						if (newChar === undefined || !/\d/.test(newChar)) continue;
						digitsFound.push({ r: nr, c: nc });
					}
				}
			}
		}
	}


	// @ts-ignore
	const wholeNumbers = []
	for (const { r, c } of digitsFound) {
		// traverse to left of each as far as possible, store in new arr, remove dupes from arr
		let cc = c;
		while (/\d/.test(world[r][cc]) && cc > 0) {
			cc--;
		}
		if (/\d/.test(world[r][cc])) {
			cc--;
		}

		cc++;
		const startC = cc
		let digits = [];
		while (/\d/.test(world[r][cc])) {
			digits.push(world[r][cc])
			cc++;
		}
		const num = +digits.join('')
		wholeNumbers.push({ r, c: startC, value: num });
	}

	// @ts-ignore
	const uniqueWholeNumbers = wholeNumbers.filter((wn, wni) => wholeNumbers.findIndex(ln => JSON.stringify(ln) === JSON.stringify(wn)) === wni)
	// @ts-ignore
	return uniqueWholeNumbers.reduce((a, b) => a + b.value, 0)
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
	const world = data.trim().split('\n').map(line => line.split(''));

	const digitsFound = [];
	for (let r = 0; r < world.length; r++) {
		const row = world[r];
		for (let c = 0; c < row.length; c++) {
			const char = row[c];
			if (char !== '.' && !/\d/.test(char)) {
				for (const ro of [-1, 0, 1]) {
					const nr = r + ro;
					for (const co of [-1, 0, 1]) {
						if (!ro && !co) continue
						const nc = c + co;
						const newChar = world[nr]?.[nc];
						if (newChar === undefined || !/\d/.test(newChar)) continue;
						digitsFound.push({ r: nr, c: nc, sym: { r, c } });
					}
				}
			}
		}
	}


	// @ts-ignore
	const wholeNumbers = []
	for (const { r, c, sym } of digitsFound) {
		// traverse to left of each as far as possible, store in new arr, remove dupes from arr
		let cc = c;
		while (/\d/.test(world[r][cc]) && cc > 0) {
			cc--;
		}
		if (/\d/.test(world[r][cc])) {
			cc--;
		}

		cc++;
		const startC = cc
		let digits = [];
		while (/\d/.test(world[r][cc])) {
			digits.push(world[r][cc])
			cc++;
		}
		const num = +digits.join('')
		wholeNumbers.push({ r, c: startC, value: num, sym });
	}


	// @ts-ignore
	const uniqueWholeNumbers = wholeNumbers.filter((wn, wni) => wholeNumbers.findIndex(ln => JSON.stringify(ln) === JSON.stringify(wn)) === wni)
	// @ts-ignore
	const symbolsToWholeNums = {};

	for (const bla of uniqueWholeNumbers) {
		const skey = JSON.stringify(bla.sym)
		// @ts-ignore
		if (!(skey in symbolsToWholeNums)) symbolsToWholeNums[skey] = [];
		// @ts-ignore
		symbolsToWholeNums[skey].push(bla);
	}
	// @ts-ignore
	const symbolsWithAtLeastTwo = Object.entries(symbolsToWholeNums).filter(([skey, things]) => things.length >= 2);
	// @ts-ignore
	return symbolsWithAtLeastTwo.reduce((a, b) => a + b[1].reduce((a, b) => a * b.value, 1), 0)
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
