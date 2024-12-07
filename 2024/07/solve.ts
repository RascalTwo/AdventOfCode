const fs = require('fs');
const assert = require('assert');



function evalRawExpr(expression: (string | number)[]) {
	while (expression.length !== 1) {
		const things = expression.splice(0, 3)
		let result = 0
		if (things[1] === '||') {
			result = +(things[0].toString() + things[2].toString())
		} else {
			result = eval(things.join(' '))
		}
		expression.splice(0, 0, result)
	}
	return expression[0]
}

function solveOne(data: string): any {
	let sum = 0;
	for (const line of data.split('\n')) {
		const [left, right] = line.split(': ')
		const target = +left;
		const nums = right.split(' ').map(Number);
		const incompletes: string[][] = [[]]
		let possible = false
		while (incompletes.length) {
			const ops = incompletes.pop()!;
			for (const op of '+*') {
				const newOps = [...ops, op]
				if (newOps.length === nums.length - 1) {
					const expression = nums.flatMap((num, i) => [num, newOps[i]].filter(v => v !== undefined))
					const result = evalRawExpr(expression)
					if (result === target) {
						possible = true
						break
					}
				} else {
					incompletes.push(newOps)
				}
			}
		}
		if (possible) {
			sum += target
		}
	}
	return sum
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

function solveTwo(data: string): any {
	let sum = 0;
	for (const line of data.split('\n')) {
		const [left, right] = line.split(': ')
		const target = +left;
		const nums = right.split(' ').map(Number);
		const incompletes: string[][] = [[]]
		let possible = false
		while (incompletes.length) {
			const ops = incompletes.pop()!;
			for (const op of ['+', '*', '||']) {
				const newOps = [...ops, op]
				if (newOps.length === nums.length - 1) {
					const expression = nums.flatMap((num, i) => [num, newOps[i]].filter(v => v !== undefined))
					const result = evalRawExpr(expression)
					if (result === target) {
						possible = true
						break
					}
				} else {
					incompletes.push(newOps)
				}
			}
		}
		if (possible) {
			sum += target
		}
	}
	return sum
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
