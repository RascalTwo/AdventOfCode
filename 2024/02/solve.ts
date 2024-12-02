const fs = require('fs');
const assert = require('assert');


function getDifferenceDirection(a: number, b: number) {
	return a > b ? 'desc' : 'asc'
}

function findUnsafeLevel(levels: number[]) {
	const dir = getDifferenceDirection(levels[0], levels[1])
	for (let i = 0; i < levels.length - 1; i++) {
		const current = levels[i];
		const next = levels[i + 1];

		const diff = Math.abs(current - next)
		if (!(1 <= diff && diff <= 3)) {
			return i
		}

		if (dir !== getDifferenceDirection(current, next)) {
			return i
		}
	}

	return -1;
}

function isReportSafe(levels: number[]) {
	return findUnsafeLevel(levels) === -1
}

function couldReportBeSafe(levels: number[]) {
	const unsafeLevel = findUnsafeLevel(levels)
	const start = Math.max(0, unsafeLevel - 1)
	const end = Math.min(levels.length, unsafeLevel + 2)

	for (let levelToRemove = start; levelToRemove < end; levelToRemove++) {
		const newLevels = levels.filter((_, i) => i !== levelToRemove)
		if (isReportSafe(newLevels)) return true;
	}
	return false
}


function solve(data: string, isSafe: (levels: number[]) => boolean): any {
	let totalSafe = 0;
	for (const line of data.split('\n')) {
		if (isSafe(line.split(' ').map(Number))) totalSafe++
	}
	return totalSafe
}

function solveOne(data: string): any {
	return solve(data, isReportSafe)
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`), 2);
	assert.deepStrictEqual(solveOne(data), 463);
})();


function solveTwo(data: string): any {
	return solve(data, levels => isReportSafe(levels) || couldReportBeSafe(levels))
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`), 4);
	assert.deepStrictEqual(solveTwo(data), 514);
})();
