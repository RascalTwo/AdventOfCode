const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any{
	return data.split('\n').reduce((sum, thing) => {
		const [e1, e2] = thing.split(',').map(p => p.split('-').map(Number));
		// check if e2 is within e1
		if (e1[0] <= e2[0] && e1[1] >= e2[1]) return sum + 1;
		// check if e1 is within e2
		if (e2[0] <= e1[0] && e2[1] >= e1[1]) return sum + 1;
		return sum;
	}, 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`), 2);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any{
	return data.split('\n').reduce((sum, thing) => {
		const [e1, e2] = thing.split(',').map(p => p.split('-').map(Number));
		// generate set of numbers from e1[0] to e1[1]
		const set1 = new Set();
		for (let i = e1[0]; i <= e1[1]; i++) set1.add(i);
		// generate set of numbers from e2[0] to e2[1]
		const set2 = new Set();
		for (let i = e2[0]; i <= e2[1]; i++) set2.add(i);

		// if sets have intersection
		if (new Set([...set1].filter(x => set2.has(x))).size > 0) return sum + 1;
		return sum;
	}, 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`), 4);
	console.log(solveTwo(data));
})();
