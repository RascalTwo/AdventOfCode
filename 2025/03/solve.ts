const fs = require('fs');
const assert = require('assert');

function findExactBatteries(bank: string, goal: number): string {
	if (!goal) return '';
	const possible = bank.slice(0, bank.length - goal + 1)
	let largestIndex = 0;
	for (let i = 1; i < possible.length; i++){
		if (possible[i] > possible[largestIndex]) {
			largestIndex = i
		}
	}
	return possible[largestIndex] + findExactBatteries(bank.slice(largestIndex + 1), goal - 1);
}

function solve(data: string, goal: number): any {
	const banks = data.trim().split('\n');
	let total = 0
	for (const bank of banks) {
		total += +findExactBatteries(bank.trim(), goal);
	}
	return total
}

function solveOne(data: string): any {
	return solve(data, 2);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`987654321111111
811111111111119
234234234234278
818181911112111`), 357);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	return solve(data, 12);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`987654321111111
811111111111119
234234234234278
818181911112111`), 3121910778619);
	console.log(solveTwo(data));
})();

export { };