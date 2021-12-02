const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): number{
	const measurements = data.trim().split('\n').map(Number);
	return measurements.slice(1).reduce((count, current, i) => count + Number(current > measurements[i]), 0);
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`199
200
208
210
200
207
240
269
260
263`), 7)
	console.log(solveOne(data));
})()


function solveTwo(data: string): number{
	const measurements = data.trim().split('\n').map(Number);
	let count = 0;
	let current = measurements.slice(0, 3).reduce((total, value) => total + value);
	for (let i = 2; i < measurements.length - 1; i++){
		const last = current;
		current = current - measurements[i - 2] + measurements[i + 1];
		if (current > last) count++;
	}
	return count;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`199
200
208
210
200
207
240
269
260
263`), 5)
	console.log(solveTwo(data));
})();
