const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	const register = new Map<string, number | { a: string, op: string, b: string }>();
	for (const line of data.split('\n')) {
		const key = line.split(': ')[0];
		const value = line.split(': ')[1];
		if (!isNaN(parseInt(value))) register.set(key, parseInt(value));
		else {
			const [a, op, b] = value.split(/ ([+-/*]) /);
			register.set(key, { a, op, b });
		}
	}
	const stack = ['root']
	while (stack.length) {
		const next = stack.at(-1)!;
		const value = register.get(next);
		if (typeof value === 'number') {
			stack.pop();
			if (next === 'root') return value;
			continue;
		}
		// @ts-ignore
		const { a, op, b } = value;
		if (typeof register.get(a) === 'number' && typeof register.get(b) === 'number') {
			register
				.set(next, eval(`${register.get(a)} ${op} ${register.get(b)}`))
		}
		if (typeof register.get(a) !== 'number') {
			stack.push(a);
		}
		if (typeof register.get(b) !== 'number') {
			stack.push(b);
		}
	}
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`), 152);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const register = new Map<string, number | { a: string, op: string, b: string }>();
	for (const line of data.split('\n')) {
		const key = line.split(': ')[0];
		const value = line.split(': ')[1];
		if (!isNaN(parseInt(value))) register.set(key, parseInt(value));
		else {
			let [a, op, b] = value.split(/ ([+-/*]) /);
			if (key === 'root') op = '==='
			register.set(key, { a, op, b });
		}
	}
	const humnDependant = new Set(['humn']);
	function doTheThing(register: Map<string, number | { a: string, op: string, b: string }>) {
		const stack = ['root']
		while (stack.length) {
			const next = stack.at(-1)!;
			const value = register.get(next);
			if (typeof value !== 'object') {
				stack.pop();
				if (next === 'root') {
					return value;
				}
				continue;
			}
			// @ts-ignore
			const { a, op, b } = value;
			if (a === 'humn' || b === 'humn') {
				humnDependant.add(next);
			} else {
				const isA = humnDependant.has(a);
				const isB = humnDependant.has(b);
				if (isA || isB) humnDependant.add(next);
			}
			if (typeof register.get(a) === 'number' && typeof register.get(b) === 'number') {
				register
					.set(next, eval(`${register.get(a)} ${op} ${register.get(b)}`))
			}
			if (typeof register.get(a) !== 'number') {
				stack.push(a);
			}
			if (typeof register.get(b) !== 'number') {
				stack.push(b);
			}
		}
	}

	function convertToExpression(register: Map<string, number | { a: string, op: string, b: string }>) {
		let expression = 'root';
		const stack = ['root']
		while (stack.length) {
			const next = stack.at(-1)!;
			const value = register.get(next)!;
			if (typeof value !== 'object') {
				expression = expression.replace(next, value.toString());
				for (const [name, v] of register.entries()){
					if (typeof v === 'number') expression = expression.replace(name, name === 'humn' ? 'X' : v.toString())
				}
				stack.pop();
				if (next === 'root') {
					return expression
				}
				continue;
			}
			expression = expression.replace(next, `(${value.a} ${value.op} ${value.b})`);
			// @ts-ignore
			const { a, op, b } = value;
			if (typeof register.get(a) === 'number' && typeof register.get(b) === 'number') {
				//if (next === 'root') console.log(register.get(a), register.get(b));
				//if (value.a === 'ljgn') console.log(expression)
				//expression = expression.replace(`(${value.a} ${value.op} \(\))`, `${register.get(a)} ${op} ${register.get(b)}`);
				//if (value.a === 'ljgn') console.log(expression)
				register
					.set(next, eval(`${register.get(a)} ${op} ${register.get(b)}`))
			}
			if (typeof register.get(a) !== 'number') {
				//console.log(a)
				expression = expression.replace(a, `(${a})`);
				stack.push(a);
			}
			if (typeof register.get(b) !== 'number') {
				//console.log(expression)
				expression = expression.replace(b, `(${b})`);
				//console.log(expression)
				stack.push(b);
			}
		}

	}

	for (let humn = -1000; humn < 1000; humn++) {
		const newRegister = new Map(register);
		newRegister.set('humn', humn);
		const isCachingNonHumanDependants = humnDependant.size === 1;
		const result = doTheThing(newRegister);
		if (isCachingNonHumanDependants) {
			for (const [key, value] of newRegister) {
				if (!humnDependant.has(key)) register.set(key, value);
			}
		}
		const newNewRegister = new Map(register);
		newRegister.set('humn', humn);
		console.log(convertToExpression(newNewRegister))
		if (result) return humn;
	}
	console.log('could not find a solution');
	return 0;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`), 301);
	console.log(solveTwo(data));
})();
