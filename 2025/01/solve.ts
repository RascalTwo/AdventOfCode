const fs = require('fs');
const assert = require('assert');

function solve(data: string){
	let dialAngle = 50;

	let pointedAtZero = 0;
	let landedAtZero = 0;

	for (const rawRotation of data.trim().split('\n')){
		const direction = rawRotation[0];
		const distance = +rawRotation.slice(1);

		const change = direction == 'L' ? -1 : 1
		for (let _ = 0; _ < distance; _++){
			dialAngle += change;

			if (dialAngle > 99) dialAngle = dialAngle - 100;
			if (dialAngle < 0) dialAngle = dialAngle + 100;

			if (dialAngle === 0) pointedAtZero++
		}
		if (dialAngle === 0) landedAtZero++
	}
	return { pointedAtZero, landedAtZero }
}


function solveOne(data: string): any{
	return solve(data).landedAtZero
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`), 3);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any{
	return solve(data).pointedAtZero
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`), 6);
	assert.deepStrictEqual(solveTwo(`R1000`), 10);
	console.log(solveTwo(data));
})();

export {};