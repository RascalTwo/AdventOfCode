const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any{
	const sums = data.split('\n\n').map(elf => elf.split('\n').map(Number).reduce((sum, n) => sum + n, 0));
	return Math.max(...sums);
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


function solveTwo(data: string): any{
	const sums = data.split('\n\n').map(elf => elf.split('\n').map(Number).reduce((sum, n) => sum + n, 0)).sort((a, b) => b - a);
	return sums.slice(0, 3).reduce((sum, n) => sum + n, 0);
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
