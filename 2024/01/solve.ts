const fs = require('fs');
const assert = require('assert');


function parseLists(data: string): [number[], number[]] {
	const lists: [number[], number[]] = [[], []]
	for (const line of data.split('\n')) {
		for (const [i, digits] of line.trim().split(/\s+/).entries()) {
			lists[i].push(+digits)
		}
	}
	return lists
}

function solveOne(data: string): any {
	const [first, second] = parseLists(data)

	first.sort((a, b) => a - b)
	second.sort((a, b) => a - b)

	let totalDistance = 0
	for (let i = 0; i < first.length; i++) {
		totalDistance += Math.abs(first[i] - second[i])
	}

	return totalDistance
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`3   4
4   3
2   5
1   3
3   9
3   3`), 11);
	assert.deepStrictEqual(solveOne(data), 2375403)
})();


function solveTwo(data: string): any {
	const [first, second] = parseLists(data)

	const listTwoCounts: Record<string, number> = {};
	for (const num of second) {
		listTwoCounts[num] = (listTwoCounts[num] ?? 0) + 1
	}

	let similarityScore = 0;
	for (const num of first) {
		similarityScore += num * (listTwoCounts[num] ?? 0);
	}
	return similarityScore;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`3   4
4   3
2   5
1   3
3   9
3   3
`), 31);
	assert.deepStrictEqual(solveTwo(data), 23082277)
})();
