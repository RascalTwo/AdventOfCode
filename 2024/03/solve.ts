const fs = require('fs');
const assert = require('assert');


function solve(data: string, conditionalMultiplications: boolean) {
	const matches = data.match(conditionalMultiplications ? /mul\(\d+,\d+\)|do\(\)|don't\(\)/g : /mul\(\d+,\d+\)/g) ?? []

	let enabled = true
	let result = 0
	for (const match of matches) {
		if (match.startsWith('do')) {
			enabled = match === 'do()'
			continue
		}

		if (enabled) {
			result += match.split('(')[1].split(')')[0].split(',').map(Number).reduce((a, b) => a * b, 1)
		}
	}
	return result
}

function solveOne(data: string): any {
	return solve(data, false)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`), 161);
	console.log(solveOne(data));
})();



function solveTwo(data: string): any {
	return solve(data, true)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`), 48);
	console.log(solveTwo(data));
})();
