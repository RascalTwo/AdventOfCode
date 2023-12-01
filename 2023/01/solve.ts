// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');

const DIGITS = Object.fromEntries([...[...'0123456789'].entries()])
const DIGITS_AND_NAMED_NUMBERS = {
	...DIGITS,
	zero: '0',
	one: '1',
	two: '2',
	three: '3',
	four: '4',
	five: '5',
	six: '6',
	seven: '7',
	eight: '8',
	nine: '9'
}

const findFirst = <T>(string: string, patterns: Record<string, T>, forward: boolean): T => {
	const start = forward ? 0 : string.length - 1;
	const end = forward ? string.length : -1;
	const change = forward ? 1 : -1;

	for (let i = start; i !== end; i += change){
		for (const pattern in patterns) {
			if (string.slice(i, i + pattern.length) === pattern) {
				return patterns[pattern];
			}
		}
	}

	throw new Error('Not found');
}

function solve(data: string, validNumbers: Record<string, string>) {
	return data.trim().split('\n')
		.map(line => Number(findFirst(line, validNumbers, true) + findFirst(line, validNumbers, false)))
		.reduce((a, b) => a + b, 0)
}


function solveOne(data: string): any {
	return solve(data, DIGITS)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`), 142);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any{
	return solve(data, DIGITS_AND_NAMED_NUMBERS)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`), 281);
	console.log(solveTwo(data));
})();
