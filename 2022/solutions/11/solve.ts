const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	const monkeys = data.split('Monkey ').slice(1).map((monkey) => {
		const index = +monkey.split(':')[0];
		const startingItems = monkey.split(':')[2].split(',').map((item) => parseInt(item));
		const operation = monkey.split('new = ')[1].split('\n')[0].trim();
		const test = parseInt(monkey.split(':')[4].split('divisible by ')[1]);
		const trueResult = parseInt(monkey.split(':')[5].split('throw to monkey')[1]);
		const falseResult = parseInt(monkey.split(':')[6].split('throw to monkey')[1]);
		return {
			index,
			startingItems,
			operation,
			test,
			trueResult,
			falseResult,
			inspectedCount: 0
		}
	})
	for (let r = 0; r < 20; r++) {
		for (const monkey of monkeys) {
			while (monkey.startingItems.length) {
				const item = monkey.startingItems.shift()!;
				monkey.inspectedCount++;
				const oldNewWorry = eval(monkey.operation.replace(/old/g, item.toString()));
				const newWorry = Math.floor(oldNewWorry / 3);
				if (newWorry % monkey.test === 0) {
					monkeys[monkey.trueResult].startingItems.push(newWorry);
				}
				else {
					monkeys[monkey.falseResult].startingItems.push(newWorry);
				}
			}
		}
	}
	const activeMonkeys = monkeys.sort((a, b) => b.inspectedCount - a.inspectedCount)
	return activeMonkeys[0].inspectedCount * activeMonkeys[1].inspectedCount;
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
	const monkeys = data.split('Monkey ').slice(1).map((monkey) => {
		const index = +monkey.split(':')[0];
		const startingItems = monkey.split(':')[2].split(',').map((item) => (parseInt(item)));
		//const operation = monkey.split('new = ')[1].split('\n')[0].trim().replace(/(\d+)/g, 'BigInt($1)');
		const operation = monkey.split('new = ')[1].split('\n')[0].trim().replace(/(\d+)/g, '$1');
		const test = (parseInt(monkey.split(':')[4].split('divisible by ')[1]));
		const trueResult = parseInt(monkey.split(':')[5].split('throw to monkey')[1]);
		const falseResult = parseInt(monkey.split(':')[6].split('throw to monkey')[1]);
		return {
			index,
			startingItems,
			operation,
			test,
			trueResult,
			falseResult,
			inspectedCount: 0
		}
	})
	const mod = monkeys.reduce((a, b) => a * b.test, (1));

	for (let r = 0; r < 10000; r++) {
		for (const monkey of monkeys) {
			while (monkey.startingItems.length) {
				const item = monkey.startingItems.shift()!;
				monkey.inspectedCount++;
				const old = item;
				let val = (0);
				//console.log(`val = ` + monkey.operation)
				eval(`val = ` + monkey.operation);
				const newWorry = val % mod;
				if (newWorry % monkey.test === (0)) {
					monkeys[monkey.trueResult].startingItems.push(newWorry);
				}
				else {
					monkeys[monkey.falseResult].startingItems.push(newWorry);
				}
			}
		}
	}
	const activeMonkeys = monkeys.sort((a, b) => b.inspectedCount - a.inspectedCount)
	return activeMonkeys[0].inspectedCount * activeMonkeys[1].inspectedCount;
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
