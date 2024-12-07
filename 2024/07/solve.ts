const fs = require('fs');
const assert = require('assert');

function canBeMadeTrue(target: number, numbers: number[], operators: Operator[]) {
	const processing: number[][] = [[...numbers].reverse()]
	while (processing.length) {
		const numbers = processing.pop()!;
		const [right, left] = numbers.splice(-2)
		for (const operator of operators) {
			const newNumber = operator(left, right)
			if (numbers.length) {
				processing.push([...numbers, newNumber])
			} else if (newNumber === target) {
				return true
			}
		}
	}
	return false
}

type Operator = (left: number, right: number) => number

function solve(data: string, ...operators: Operator[]) {
	return data.split('\n').map(line => {
		const [left, right] = line.split(': ')
		const testValue = +left;
		const numbers = right.split(' ').map(Number);
		return { testValue, numbers }
	}).filter(({ testValue, numbers }) => canBeMadeTrue(testValue, numbers, operators))
		.reduce((sum, { testValue }) => sum + testValue, 0);
}

function add(left: number, right: number) {
	return left + right;
}

function multiply(left: number, right: number) {
	return left * right;
}

function solveOne(data: string): any {
	return solve(data, add, multiply)
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`.trim()), 3749);
	console.log(solveOne(data));
})();

function concatenate(left: number, right: number) {
	return +(left.toString() + right.toString())
}

function solveTwo(data: string): any {
	return solve(data, add, multiply, concatenate)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`.trim()), 11387);
	console.log(solveTwo(data));
})();
