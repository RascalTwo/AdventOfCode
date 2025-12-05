const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any{
	const [a, b] = data.trim().split('\r\n\r\n');
	const ranges = a.split('\n').map(l => l.split('-').map(Number));
	const ings = b.split('\n').map(Number);
	let frec = 0

	for (const ing of ings){
		let fresh = false;
		for (const [start, end] of ranges){
			if (ing >= start && ing <= end) {
				fresh = true;
				break
			}
		}
		if (fresh) {
			frec++
		}
	}
	return frec
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


function solveTwo(data: string): any{
	const [a,] = data.trim().split('\r\n\r\n');
	const ranges = a.split('\n').map(l => l.split('-').map(Number));
	while (true){
		let changed = false;
		for (let [ai, a] of ranges.entries()){
			for (let [bi, b] of ranges.entries()){
				if (ai === bi) continue;
				const [aStart, aEnd] = a;
				const [bStart, bEnd] = b;
				if ((aStart >= bStart && aStart <= bEnd) || (aEnd >= bStart && aEnd <= bEnd) || (bStart >= aStart && bStart <= aEnd) || (bEnd >= aStart && bEnd <= aEnd)){
					const newStart = Math.min(aStart, bStart)
					const newEnd = Math.max(aEnd, bEnd)
					ranges.splice(bi, 1)
					a[0] = newStart
					a[1] = newEnd
					changed = true
				}
				if (changed) break
			}
				if (changed) break
		}
		if (!changed) break
	}
	let total = 0
	for (const [start, end] of ranges){
		total += end - start + 1
	}
	return total
}

				/*
16-20
12-18
03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23
AS    AE
                     BS          BE

10 11 12 13 14 15 16 17 18 19 20 21 22 23
      BS                 BE
			            AS           AE

      BS                 BE
AS           AE

      AS                 AE
			            BS           BE

      AS                 AE
BS           BE
				*/

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`3-5
10-14
16-20
12-18`), 14);
	console.log(solveTwo(data));
})();

export {};