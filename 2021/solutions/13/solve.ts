const fs = require('fs');
const assert = require('assert');


function solve(data: string, allFolds: boolean){
	const [dotLines, foldLines] = data.trim().split('\n\n').map(chunk => chunk.split('\n'));
	let dots = dotLines.map(pair => pair.split(',').map(Number) as [number, number]);
	const folds: [string, number][] = foldLines.map(line => line.split('along ')[1].split('=')).map(([axis, loc]) => [axis, Number(loc)]);
	for (const [axis, loc] of (folds.slice(0, allFolds ? undefined : 1))){
		const index = 'xy'.indexOf(axis);

		const newDots: [number, number][] = [];
		for (const dot of dots){
			if (dot[index] < loc) newDots.push(dot)
			else {
				const offset = 2 * loc;
				newDots.push(index === 0 ? [offset - dot[0], dot[1]] : [dot[0], offset - dot[1]]);
			}
		}
		dots = [...new Set(newDots.map(dot => JSON.stringify(dot)))].map(rawDot => JSON.parse(rawDot))
	}

	const dotsSet = new Set(dots.map(dot => JSON.stringify(dot)));

	if (allFolds){
		let [mx, my] = [1, 1];
		for (const [x, y] of dots){
			mx = Math.max(mx, x);
			my = Math.max(my, y);
		}
		for (let y = 0; y < my + 1; y++){
			let line = '';
			for (let x = 0; x < mx + 1; x++){
				line += ' #'[Number(dotsSet.has(JSON.stringify([x, y])))];
			}
			console.log(line);
		}
	}

	return dots.length;
}


function solveOne(data: string): number{
	return solve(data, false);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`), 17);
	console.log(solveOne(data));
})();


function solveTwo(data: string): number{
	return solve(data, true);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`), 16);
	solveTwo(data);
})();
