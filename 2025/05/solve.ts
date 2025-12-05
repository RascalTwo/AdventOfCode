const fs = require('fs');
const assert = require('assert');


function parseDatabase(data: string) {
	const [rawRanges, rawIngredients = ''] = data.trim().split('\r\n\r\n');
	const ranges = rawRanges.split('\n').map(l => l.split('-').map(Number) as [number, number]);
	const ingredients = rawIngredients.split('\n').map(Number);
	return [ranges, ingredients] as const
}

function combineRanges(ranges: [number, number][]) {
	while (true){
		let rangesMerges = false;
		for (const a of ranges) {
			for (const b of ranges) {
				if (a === b) continue;

				const [aStart, aEnd] = a;
				const [bStart, bEnd] = b;
				if ((aStart >= bStart && aStart <= bEnd) || (aEnd >= bStart && aEnd <= bEnd) || (bStart >= aStart && bStart <= aEnd) || (bEnd >= aStart && bEnd <= aEnd)) {
					a[0] = Math.min(aStart, bStart)
					a[1] = Math.max(aEnd, bEnd)

					ranges.splice(ranges.indexOf(b), 1)

					rangesMerges = true
					break
				}
			}
		}
		if (!rangesMerges) break;
	}
}

function solve(data: string) {
	const [ranges, ingredients] = parseDatabase(data);

	combineRanges(ranges)

	let rangeTotal = 0
	for (const [start, end] of ranges) {
		rangeTotal += end - start + 1
	}

	let freshIngredientCount = 0
	for (const ingredient of ingredients) {
		if (ranges.some(([start, end]) => start <= ingredient && ingredient <= end)) {
			freshIngredientCount++
		}
	}

	return { rangeTotal, freshIngredientCount }
}



function solveOne(data: string): any {
	return solve(data).freshIngredientCount
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`3-5
10-14
16-20
12-18\r
\r
1
5
8
11
17
32`), 3);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	return solve(data).rangeTotal
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`3-5
10-14
16-20
12-18`), 14);
	console.log(solveTwo(data));
})();

export { };