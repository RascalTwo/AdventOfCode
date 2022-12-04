const fs = require('fs');
const assert = require('assert');


const parseSectionRanges = (data: string): [[number, number], [number, number]][] => data.split('\n').map(line =>
		line.split(',').map(p => p.split('-').map(Number) as [number ,number]) as [[number, number], [number, number]])

function solveOne(data: string): any{
	return parseSectionRanges(data).reduce((sum, [e1, e2]) => {
		return sum + +(e1[0] <= e2[0] && e1[1] >= e2[1] || e2[0] <= e1[0] && e2[1] >= e1[1])
	}, 0);
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
	return parseSectionRanges(data).reduce((sum, [e1, e2]) => {
		return sum + +((e1[0] <= e2[0] && e1[1] >= e2[1] || e2[0] <= e1[0] && e2[1] >= e1[1]) || (e1[0] <= e2[0] && e1[1] >= e2[0] || e2[0] <= e1[0] && e2[1] >= e1[0]))
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
