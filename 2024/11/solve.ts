const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	const stones = data.split(' ').map(Number);
	for (let _ = 0; _ < 25; _++) {
		for (let s = 0; s < stones.length; s++) {
			const stone = stones[s]
			const stoneStr = stone.toString()
			if (stone === 0) {
				stones[s] = 1
			}
			else if (stoneStr.length % 2 === 0) {
				const left = stoneStr.slice(0, stoneStr.length / 2)
				const right = stoneStr.slice(stoneStr.length / 2)
				stones.splice(s, 1, +left, +right)
				s++
			}
			else {
				stones[s] *= 2024
			}
		}
	}
	return stones.length
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`125 17`), 55312);
	console.log(solveOne(data));
})();


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

function solveTwo(data: string): any {
	let stoneCounts = data.split(' ').map(Number).reduce((counts, stone) => ({ ...counts, [stone]: (counts[stone]) ?? 0 + 1 }), {} as Record<number, number>)
	for (let _ = 0; _ < 75; _++) {
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


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	console.log(solveTwo(data));
})();
