const fs = require('fs');
const assert = require('assert');


function solve(data: string, steps: number) {
	const template = data.trim().split('\n')[0];
	const rules = data.trim().split('\n\n')[1].split('\n').map(line => line.split(' -> ')).reduce<Record<string, string>>((rules, [pair, inserting]) => ({ ...rules, [pair]: inserting }), {});

	let pairs: Record<string, number> = {}
	for (let i = 0; i < template.length - 1; i++) {
		const pair = template.slice(i, i + 2);
		if (!(pair in pairs)) pairs[pair] = 0;
		pairs[pair]++;
	}
	for (let _ = 0; _ < steps; _++) {
		const newPairs: Record<string, number> = {}
		for (const [pair, count] of Object.entries(pairs)) {
			const inserting = rules[pair];
			for (const newPair of [pair[0] + inserting, inserting + pair[1]]) {
				if (!(newPair in newPairs)) newPairs[newPair] = 0;
				newPairs[newPair] += count;
			}
		}
		pairs = newPairs;
	}

	const counts: Record<string, number> = {}
	for (const [[_, right], count] of Object.entries(pairs)) {
		if (!(right in counts)) counts[right] = 0;
		counts[right] += count;
	}
	counts[template[0]]++;

	return Math.max(...Object.values(counts)) - Math.min(...Object.values(counts));
}

function solveOne(data: string): number {
	return solve(data, 10)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`), 1588);
	console.log(solveOne(data));
})();


function solveTwo(data: string): number {
	return solve(data, 40)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`), 2188189693529);
	console.log(solveTwo(data));
})();
