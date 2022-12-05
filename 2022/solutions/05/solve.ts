const fs = require('fs');
const assert = require('assert');



function solveOne(data: string, stacks: any): any {
	console.log(data);
	for (const inst of data.split('\n')) {
		const count = parseInt(inst.split('move ')[1])
		const orig = parseInt(inst.split(' from ')[1])
		const dest = parseInt(inst.split(' to ')[1])
		for (let i = 0; i < count; i++) {
			stacks[dest].push(stacks[orig].pop())
		}
	}
	// get tops of all stacks
	const tops = Object.values(stacks).map((stack: any) => stack[stack.length - 1])
	return tops.join('')
}

/*
			[D]    
	[N] [C]    
	[Z] [M] [P]
	 1   2   3 
	 */
(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	/*assert.deepStrictEqual(solveOne(`move 1 from 2 to 1
	move 3 from 1 to 3
	move 2 from 2 to 1
	move 1 from 1 to 2`, {
		1: ['Z', 'N'],
		2: ['M', 'C', 'D'],
		3: ['P']
	}), 'CMZ');*/
	/*
			[G]         [P]         [M]    
			[V]     [M] [W] [S]     [Q]    
			[N]     [N] [G] [H]     [T] [F]
			[J]     [W] [V] [Q] [W] [F] [P]
	[C] [H]     [T] [T] [G] [B] [Z] [B]
	[S] [W] [S] [L] [F] [B] [P] [C] [H]
	[G] [M] [Q] [S] [Z] [T] [J] [D] [S]
	[B] [T] [M] [B] [J] [C] [T] [G] [N]
	 1   2   3   4   5   6   7   8   9 
	 */
	const stacks = {
		1: ['C', 'S', 'G', 'B'].reverse(),
		2: ['G',
			'V',
			'N',
			'J',
			'H',
			'W',
			'M',
			'T',].reverse(),
		3: ['M', 'Q', 'S'],
		4: [
			'M',
			'N',
			'W',
			'T',
			'L',
			'S',
			'B',].reverse(),
		5: [
			'P',
			'W',
			'G',
			'V',
			'T',
			'F',
			'Z',
			'J',
		].reverse(),
		6: [
			'S',
			'H',
			'Q',
			'G',
			'B',
			'T',
			'C'
		].reverse(),
		7: [
			'W',
			'B',
			'P',
			'J',
			'T',
		].reverse(),
		8: [
			'M',
			'Q',
			'T',
			'F',
			'Z',
			'C',
			'D',
			'G',
		].reverse(),
		9: [
			'F',
			'P',
			'B',
			'H',
			'S',
			'N',
		].reverse()
	}
	console.log(solveOne(data.split('\n\n')[1].trim(), stacks));
})();


function solveTwo(data: string, stacks: any): any {
	console.log(data);
	for (const inst of data.split('\n')) {
		const count = parseInt(inst.split('move ')[1])
		const orig = parseInt(inst.split(' from ')[1])
		const dest = parseInt(inst.split(' to ')[1])
		const newArr = [];
		// get count off of top into new array
		for (let i = 0; i < count; i++) {
			newArr.push(stacks[orig].pop())
		}
		stacks[dest].push(...newArr.reverse())
	}
	// get tops of all stacks
	const tops = Object.values(stacks).map((stack: any) => stack[stack.length - 1])
	return tops.join('')
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	
	assert.deepStrictEqual(solveTwo(`move 1 from 2 to 1
	move 3 from 1 to 3
	move 2 from 2 to 1
	move 1 from 1 to 2`, {
		1: ['Z', 'N'],
		2: ['M', 'C', 'D'],
		3: ['P']
	}), 'MCD');
	/*
			[G]         [P]         [M]    
			[V]     [M] [W] [S]     [Q]    
			[N]     [N] [G] [H]     [T] [F]
			[J]     [W] [V] [Q] [W] [F] [P]
	[C] [H]     [T] [T] [G] [B] [Z] [B]
	[S] [W] [S] [L] [F] [B] [P] [C] [H]
	[G] [M] [Q] [S] [Z] [T] [J] [D] [S]
	[B] [T] [M] [B] [J] [C] [T] [G] [N]
	 1   2   3   4   5   6   7   8   9 
	 */
	 const stacks = {
		1: ['C', 'S', 'G', 'B'].reverse(),
		2: ['G',
			'V',
			'N',
			'J',
			'H',
			'W',
			'M',
			'T',].reverse(),
		3: ['M', 'Q', 'S'],
		4: [
			'M',
			'N',
			'W',
			'T',
			'L',
			'S',
			'B',].reverse(),
		5: [
			'P',
			'W',
			'G',
			'V',
			'T',
			'F',
			'Z',
			'J',
		].reverse(),
		6: [
			'S',
			'H',
			'Q',
			'G',
			'B',
			'T',
			'C'
		].reverse(),
		7: [
			'W',
			'B',
			'P',
			'J',
			'T',
		].reverse(),
		8: [
			'M',
			'Q',
			'T',
			'F',
			'Z',
			'C',
			'D',
			'G',
		].reverse(),
		9: [
			'F',
			'P',
			'B',
			'H',
			'S',
			'N',
		].reverse()
	}
	console.log(solveTwo(data.split('\n\n')[1].trim(), stacks));
})();
