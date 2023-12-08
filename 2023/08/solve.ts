// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');


const gcd = (a: number, b: number) => {
	while (b) [a, b] = [b, a % b];
	return a
}

const lcm = (a: number, b: number) => {
	return a * b / gcd(a, b)
}

const parseChoices = (data: string) => data.trim().split('\n')[0].toLowerCase().split('');

const generateGraph = (lines: string[]) => {
	const graph = lines.reduce((graph, line) => {
		const label = line.split(' ')[0];
		const [left, right] = line.split('(')[1].split(')')[0].split(', ')

		graph.set(label, { label, l: left, r: right });

		return graph
	}, new Map())

	for (const node of graph.values()) {
		if (typeof node.l === 'string') node.l = graph.get(node.l)
		if (typeof node.r === 'string') node.r = graph.get(node.r)
	}

	return graph
}

function solve(data: string, startRegex: RegExp, endRegex: RegExp): any {
	const choices = parseChoices(data)
	const graph = generateGraph(data.trim().split('\n\n')[1].split('\n'));

	return [...graph.values()]
		.filter(({ label }) => startRegex.test(label))
		.reduce((totalSteps, node) => {
			let steps = 0;
			for (let choiceIndex = 0; !endRegex.test(node.label); choiceIndex++, steps++)
				node = node[choices[choiceIndex % choices.length]];
			return lcm(totalSteps, steps)
		}, 1)
}

function solveOne(data: string): any {
	return solve(data, /AAA/, /ZZZ/)
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
	return solve(data, /A$/, /Z$/)
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
