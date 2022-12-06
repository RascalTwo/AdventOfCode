const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any{
	for (let i = 0; i < data.length - 4; i++) {
		let next4chars = data.substr(i, 4);
		next4chars
		if (new Set(next4chars).size === 4){
			return i + 4
		}
	}
	return true;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`mjqjpqmgbljsphdztnvjfqwrcgsmlb`), 7);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any{
	for (let i = 0; i < data.length - 14; i++) {
		let next4chars = data.substr(i, 14);
		next4chars
		if (new Set(next4chars).size === 14){
			return i + 14
		}
	}
	return true;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`mjqjpqmgbljsphdztnvjfqwrcgsmlb`), 19);
	console.log(solveTwo(data));
})();
