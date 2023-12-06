// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');


const zip = <T>(...[first, ...others]: T[][]) => first.map((v, i) => [v, ...others.map(arr => arr[i])]);

function solve(data: string) {
	const timesAndDistances = zip(...data.split('\n').map((s) => s.split(/\s+/).slice(1).map(Number)))

	let totalWays = 1;
	for (const [time, distance] of timesAndDistances) {
		let ways = 0;
		for (let hold = 1; hold < time; hold++)
			if (hold * (time - hold) > distance) ways++
		totalWays *= ways
	}

	return totalWays
}


function solveOne(data: string): any {
	return solve(data)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`Time:      7  15   30
Distance:  9  40  200`), 288);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	return solve(data.replace(/ /g, '').replace(/:/g, ': '))
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`Time:      7  15   30
Distance:  9  40  200`), 71503);
	console.log(solveTwo(data));
})();
