const fs = require('fs');
const assert = require('assert');


const charToDigit = {
	2: 2,
	1: 1,
	0: 0,
	'-': -1,
	'=': -2,
}

function snafuToDecimal(string: string): number {
	let result = 0;
	for (const char of string) {
		// @ts-ignore
		result = result * 5 + charToDigit[char]!;
	}
	return result;
}

function decimalToSnafu(number: number): string {
	let result = '';
	while (number > 0) {
		const digit = number % 5;
		if (digit === 0) {
			result = '0' + result;
		}
		if (digit === 1) {
			result = '1' + result;
		}
		if (digit === 2) {
			result = '2' + result;
		}
		if (digit === 3) {
			number += 2
			result = `=` + result;
		}
		if (digit === 4) {
			number++
			result = `-` + result;
		}
		number = Math.floor(number / 5);
	}
	return result;
}

function solveOne(data: string): any{
	const digits = data.split('\n').map(snafuToDecimal);

	const sum = digits.reduce((a, b) => a + b, 0);
	return decimalToSnafu(sum);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(snafuToDecimal('1'), 1);
	assert.deepStrictEqual(decimalToSnafu(1), '1');
	assert.deepStrictEqual(snafuToDecimal('2'), 2);
	assert.deepStrictEqual(decimalToSnafu(2), '2');
	assert.deepStrictEqual(snafuToDecimal('1='), 3);
	assert.deepStrictEqual(decimalToSnafu(3), '1=');
	assert.deepStrictEqual(snafuToDecimal('1-'), 4);
	assert.deepStrictEqual(decimalToSnafu(4), '1-');
	assert.deepStrictEqual(snafuToDecimal('10'), 5);
	assert.deepStrictEqual(decimalToSnafu(5), '10');
	assert.deepStrictEqual(snafuToDecimal('11'), 6);
	assert.deepStrictEqual(decimalToSnafu(6), '11');
	assert.deepStrictEqual(snafuToDecimal('12'), 7);
	assert.deepStrictEqual(decimalToSnafu(7), '12');
	assert.deepStrictEqual(snafuToDecimal('2='), 8);
	assert.deepStrictEqual(decimalToSnafu(8), '2=');
	assert.deepStrictEqual(snafuToDecimal('2-'), 9);
	assert.deepStrictEqual(decimalToSnafu(9), '2-');
	assert.deepStrictEqual(snafuToDecimal('20'), 10);
	assert.deepStrictEqual(decimalToSnafu(10), '20');
	assert.deepStrictEqual(snafuToDecimal('1=0'), 15);
	assert.deepStrictEqual(decimalToSnafu(15), '1=0');
	assert.deepStrictEqual(snafuToDecimal('1-0'), 20);
	assert.deepStrictEqual(decimalToSnafu(20), '1-0');
	assert.deepStrictEqual(snafuToDecimal('1=11-2'), 2022);
	assert.deepStrictEqual(decimalToSnafu(2022), '1=11-2');
	assert.deepStrictEqual(snafuToDecimal('1-0---0'), 12345);
	assert.deepStrictEqual(decimalToSnafu(12345), '1-0---0');
	assert.deepStrictEqual(snafuToDecimal('1121-1110-1=0'), 314159265);
	assert.deepStrictEqual(decimalToSnafu(314159265), '1121-1110-1=0');

	assert.deepStrictEqual(solveOne(`1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`), '2=-1=0');
	console.log(solveOne(data));
})();


function solveTwo(data: string): any{
	return true;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(``), true);
	console.log(solveTwo(data));
})();
