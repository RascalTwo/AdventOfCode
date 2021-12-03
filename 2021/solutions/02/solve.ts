const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): number{
	let horizontal = 0;
	let depth = 0;

	for (const line of data.trim().split('\n')){
		const [command, rawUnits] = line.split(' ');
		const units = Number(rawUnits);

		if (command === 'forward') horizontal += units;
		else depth += command === 'down' ? units : -units;
	}

	return horizontal * depth;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`forward 5
down 5
forward 8
up 3
down 8
forward 2`), 150);
	console.log(solveOne(data));
})()


function solveTwo(data: string): any{
	let horizontal = 0;
	let depth = 0;
	let aim = 0;

	for (const line of data.trim().split('\n')){
		const [command, rawUnits] = line.split(' ');
		const units = Number(rawUnits);

		if (command === 'forward') {
			horizontal += units;
			depth += aim * units;
		}
		else aim += command === 'down' ? units : -units;
	}

	return horizontal * depth;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`forward 5
down 5
forward 8
up 3
down 8
forward 2`), 900);
	console.log(solveTwo(data));
})();
