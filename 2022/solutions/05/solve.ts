const fs = require('fs');
const assert = require('assert');


const moveSupplies = (data: string, is9001: boolean) => {
	const [rawStack, rawInstructions] = data.split('\n\n');


	const stacks: Record<string, string[]> = {};

	const rawCrates = rawStack.split('\n').reverse();
	const rawIndexes = rawCrates.shift();
	for (const { 0: value, index } of rawIndexes.matchAll(/\d+/g)) {
		stacks[value] = [];
		for (const line of rawCrates) {
      if (line[index - 1] !== '[') break
			stacks[value].push(line.slice(index).split(']')[0]);
		}
	}


	for (const [ _, ...instruction] of rawInstructions.matchAll(/move (\d+) from (\d+) to (\d+)/g)) {
		const [count, origin, destination] = instruction.map(Number);
		if (!is9001) for (let i = 0; i < count; i++) stacks[destination].push(stacks[origin].pop());
		else stacks[destination].push(...stacks[origin].splice(-count));
	}

	return Object.values(stacks).map(stack => stack[stack.length - 1]).join('');
}


function solveOne(data: string): any {
	return moveSupplies(data, false);
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`), 'CMZ');
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	return moveSupplies(data, true);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();

	assert.deepStrictEqual(solveTwo(`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`), 'MCD');
	console.log(solveTwo(data));
})();
