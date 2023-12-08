// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');



function solveOne(data: string): any {
	const choices = data.trim().split('\n')[0].replace(/R/g, '1').replace(/L/g, '0').split('').map(Number);

	const nodes = data.trim().split('\n\n')[1].split('\n').map(line => {
		const origin = line.split(' ')[0];
		const [left, right] = line.split('(')[1].split(')')[0].split(', ')
		return { origin, left, right }
	})
	const map = new Map()
	for (const node of nodes) map.set(node.origin, [node.left, node.right])

	let steps = 0;
	let choiceIndex = 0;
	let current = 'AAA'
	while (current !== 'ZZZ') {
		steps++;
		current = map.get(current)[choices[choiceIndex++ % choices.length]]
	}

	return steps
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`), 2);
	assert.deepStrictEqual(solveOne(`LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`), 6);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const choices = data.trim().split('\n')[0].replace(/R/g, '1').replace(/L/g, '0').split('').map(Number);

	const nodes = data.trim().split('\n\n')[1].split('\n').map(line => {
		const origin = line.split(' ')[0];
		const [left, right] = line.split('(')[1].split(')')[0].split(', ')
		return { origin, left, right }
	})
	const map = new Map()
	for (const node of nodes) map.set(node.origin, [node.left, node.right])

	let stepsTaken = [];
	for (const [n, node] of nodes.entries()) {
		if (node.origin[2] !== 'A') continue;
		let steps = 0;
		let current = node.origin
		while (current[2] !== 'Z') {
			for (const i of choices) {
				current = map.get(current)[i]
				steps++
				if (current[2] === 'Z') break;
			}
		}
		stepsTaken.push(steps);
	}

	return stepsTaken.reduce((a, b) => lcm(a, b))
}

const gcd = (a: number, b: number) => {
	while (b) {
		[a, b] = [b, a % b]
	}
	return a
}

const lcm = (a: number, b: number) => {
	return a * b / gcd(a, b)
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`), 6);
	console.log(solveTwo(data));
})();
