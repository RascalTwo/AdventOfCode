const fs = require('fs');
const assert = require('assert');

function solveOne(data: string){
	let largest = -Infinity, current = 0;

	for (const line of data.split('\n')) {
		if (line === '') {
			largest = Math.max(largest, current);
			current = 0;
		} else current += +line;
	}
	largest = Math.max(largest, current);

	return largest;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`), 24000);
	console.log(solveOne(data));
})();


const sumArray = (array: number[]) => array.reduce((sum, n) => sum + n, 0);
const getElfSums = (data: string) => data.split('\n\n').map(elf => sumArray(elf.split('\n').map(Number)));

function solveTwo(data: string): any{
	return sumArray(getElfSums(data).sort((a, b) => b - a).slice(0, 3));
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`), 45000);
	console.log(solveTwo(data));
})();
