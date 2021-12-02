const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any{
	return true;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(``), true);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any{
	return true;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(``), true);
	console.log(solveTwo(data));
})();
