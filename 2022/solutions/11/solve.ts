const fs = require('fs');
const assert = require('assert');


interface Monkey {
	items: number[]
	operation: string;
	test: number;
	trueMonkey: number;
	falseMonkey: number;
	inspected: number;
}

const parseMonkeys = (data: string): Monkey[] => data.split('Monkey ').slice(1).map((monkey) => ({
	items: monkey.split(':')[2].split(',').map((item) => parseInt(item)),
	operation: monkey.split('new = ')[1].split('\n')[0].trim(),
	test: parseInt(monkey.split(':')[4].split('divisible by ')[1]),
	trueMonkey: parseInt(monkey.split(':')[5].split('throw to monkey')[1]),
	falseMonkey: parseInt(monkey.split(':')[6].split('throw to monkey')[1]),
	inspected: 0
}));


function simulateMonkeys(monkeys: Monkey[], rounds: number, manageFrustration: (frustration: number) => number): any {
	for (let r = 0; r < rounds; r++) {
		for (const monkey of monkeys) {
			while (monkey.items.length) {
				monkey.inspected++;

				const newWorry = manageFrustration(eval(monkey.operation.replace(/old/g, monkey.items.shift()!.toString())));
				const newMonkeyIndex = newWorry % monkey.test === 0 ? monkey.trueMonkey : monkey.falseMonkey;
				monkeys[newMonkeyIndex].items.push(newWorry);
			}
		}
	}
	return monkeys.sort((a, b) => b.inspected - a.inspected).slice(0, 2).reduce((a, b) => a * b.inspected, 1)
}


function solveOne(data: string): any {
	return simulateMonkeys(parseMonkeys(data), 20, (frustration) => Math.floor(frustration / 3));
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3
		.split('Test')[0].trim();
Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`), 10605);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const monkeys = parseMonkeys(data);
	const mod = monkeys.reduce((a, b) => a * b.test, 1);
	return simulateMonkeys(monkeys, 10000, (frustration) => frustration % mod);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`
	Monkey 0:
		Starting items: 79, 98
		Operation: new = old * 19
		Test: divisible by 23
			If true: throw to monkey 2
			If false: throw to monkey 3
	Monkey 1:
		Starting items: 54, 65, 75, 74
		Operation: new = old + 6
		Test: divisible by 19
			If true: throw to monkey 2
			If false: throw to monkey 0
	Monkey 2:
		Starting items: 79, 60, 97
		Operation: new = old * old
		Test: divisible by 13
			If true: throw to monkey 1
			If false: throw to monkey 3
			.split('Test')[0].trim();
	Monkey 3:
		Starting items: 74
		Operation: new = old + 3
		Test: divisible by 17
			If true: throw to monkey 0
			If false: throw to monkey 1
	`), 2713310158);
	console.log(solveTwo(data));
})();
