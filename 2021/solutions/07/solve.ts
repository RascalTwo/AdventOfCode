const fs = require('fs');
const assert = require('assert');

function averageMinMax(numbers: number[]): [number, number, number]{
	let average = numbers[0];
	let min = numbers[0];
	let max = numbers[0];
	for (const number of numbers.slice(1)){
		average += number;
		if (number < min) min = number
		else if (number > max) max = number
	}
	return [Math.trunc(average / numbers.length), min, max];
}

function solve(positions: number[], calculateCost: (distance: number) => number): number{
	let best = Number.MAX_SAFE_INTEGER;
	const [average, min, max] = averageMinMax(positions);
	let i = 0;
	while(true){
		const costs = []
		for (const side of [1, -1]){
			const target = average + (i * side);
			if (target < min || target > max) break;
			costs.push(positions.reduce((cost, position) => cost + calculateCost(Math.abs(position - target)), 0));
		}
		if (!costs.length) break;

		best = Math.min(best, ...costs);
		i++;
	}
	return best;
}


function solveOne(data: string): number{
	return solve(data.trim().split(',').map(Number), distance => distance);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`16,1,2,0,4,2,7,1,2,14`), 37);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any{
	return solve(data.trim().split(',').map(Number), distance => Math.floor(distance * (distance + 1) / 2));
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`16,1,2,0,4,2,7,1,2,14`), 168);
	console.log(solveTwo(data));
})();
