const fs = require('fs');
const assert = require('assert');

type Operation = '+' | '-' | '*' | '/' | '===';
interface Equation {
	a: string;
	op: Operation;
	b: string;
}

const generateRegister = (data: string) => {
	const register = new Map<string, number | boolean | Equation>();
	for (const line of data.split('\n')) {
		const [key, value] = line.split(': ');
		const parts = value.split(' ');
		if (parts.length === 1) {
			register.set(key, parseInt(value));
		} else {
			const [a, op, b] = parts;
			register.set(key, { a, op: op as Operation, b });
		}
	}
	return register;
}

function evaluateRegister(register: Map<string, number | boolean | Equation>, humnDependents: Set<string> = new Set(), variables: Record<string, string> = {}): { value: number | boolean, expression: string } {
	let expression = 'root';
	const stack = ['root']
	while (stack.length) {
		const next = stack.at(-1)!;
		const value = register.get(next)!;
		if (typeof value !== 'object') {
			for (const [name, value] of register.entries()) {
				if (typeof value !== 'object') expression = expression.replace(name, variables[name] || value.toString())
			}
			stack.pop();
			if (next === 'root') {
				return { value, expression: expression.slice(1, -1).replace('===', '=') };
			}
			continue;
		}
		expression = expression.replace(next, `(${value.a} ${value.op} ${value.b})`);

		const { a, op, b } = value;

		if (humnDependents.has(a) || humnDependents.has(b)) humnDependents.add(next);

		const aValue = register.get(a);
		const bValue = register.get(b);
		if (typeof aValue === 'number' && typeof bValue === 'number') {
			register.set(next, eval(`${aValue} ${op} ${bValue}`)); // todo - don't eval
		}
		if (typeof aValue !== 'number') stack.push(a);
		if (typeof bValue !== 'number') stack.push(b);
	}

	return { value: NaN, expression: '' };
}

function solveOne(data: string): any {
	return evaluateRegister(generateRegister(data)).value;
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
	const register = generateRegister(data);

	(register.get('root')! as Equation).op = '===';

	const humnDependents = new Set(['humn']);

	let result;
	for (let humn = 300; humn < 302; humn++) {
		const newRegister = new Map(register);
		newRegister.set('humn', humn);

		const isCachingNonHumanDependents = humnDependents.size === 1;

		result = evaluateRegister(newRegister, humnDependents, { humn: 'X' });
		if (isCachingNonHumanDependents) for (const [key, value] of newRegister) {
			if (!humnDependents.has(key)) register.set(key, value);
		}
		if (result.value) return humn;
	}

	return result?.expression;
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
	// Paste expression into site such as: https://www.dcode.fr/equation-solver
})();
