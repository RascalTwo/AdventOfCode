const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	data = data.trim()
	const lists = [[], []]
	data.split('\n').map((line, i) => {
		line.trim().split(/\s+/).map((p, i) => lists[i].push(+p))
	})
	lists.forEach(l => l.sort((a, b) => a - b))
	const distances = lists[0].map((_, i) => {
		return Math.abs(lists[0][i] - lists[1][i])
	})
	return distances.reduce((a, b) => a + b, 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`3   4
4   3
2   5
1   3
3   9
3   3`), 11);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	data = data.trim()
	const lists = [[], []]
	data.split('\n').map((line, i) => {
		line.trim().split(/\s+/).map((p, i) => lists[i].push(+p))
	})
	const inList2 = {};
	for (const char of lists[1]) {
		if (!(char in inList2)) inList2[char] = 0
		inList2[char] += 1
	}

	const scores = lists[0].map(c => {
		return c * (inList2[c] ?? 0)
	})
	return scores.reduce((a, b) => a + b, 0)
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
	console.log(solveTwo(data));
})();
