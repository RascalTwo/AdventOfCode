const fs = require('fs');
const assert = require('assert');


function changeStone(stone: string): number[] {
	if (+stone == 0) {
		return [1]
	}
	else if (stone.length % 2 === 0) {
		const left = stone.slice(0, stone.length / 2)
		const right = stone.slice(stone.length / 2)
		return [left, right].map(Number)
	}
	else {
		return [+stone * 2024]
	}
}

function solve(data: string, blinks: number): any {
	let stoneCounts = data.split(' ').map(Number).reduce((counts, stone) => ({ ...counts, [stone]: (counts[stone]) ?? 0 + 1 }), {} as Record<number, number>)
	for (let _ = 0; _ < blinks; _++) {
		const newCounts: Record<number, number> = {}
		for (const [stone, count] of Object.entries(stoneCounts)) {
			for (const newStone of changeStone(stone)) {
				newCounts[newStone] = (newCounts[newStone] ?? 0) + count
			}
		}
		stoneCounts = newCounts
	}
	return Object.values(stoneCounts).reduce((a, b) => a + b, 0)
}

function solveOne(data: string): any {
	return solve(data, 25)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`125 17`), 55312);
	console.log(solveOne(data));
})();



function solveTwo(data: string): any {
	return solve(data, 75)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	console.log(solveTwo(data));
})();
