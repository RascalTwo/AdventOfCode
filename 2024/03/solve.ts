const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	const matches = data.match(/mul\(\d+,\d+\)/ig)
	const results = matches?.map(match => {
		const [a, b] = match.split('(')[1].split(')')[0].split(',').map(Number)
		return a * b
	})
	return results?.reduce((a, b) => a + b, 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`), 161);
	console.log(solveOne(data));
})();



function solveTwo(data: string): any {
	const matches = data.match(/((mul\(\d+,\d+\))|(do\(\))|(don't\(\)))/ig)
	let enabled = true
	const results = matches?.map(match => {
		if (match.startsWith('do')) {
			enabled = match === 'do()'
			return 0
		}
		if (enabled) {
			const [a, b] = match.split('(')[1].split(')')[0].split(',').map(Number)
			return a * b
		}
		else {
			return 0
		}
	})
	return results?.reduce((a, b) => a + b, 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`), 48);
	console.log(solveTwo(data));
})();
