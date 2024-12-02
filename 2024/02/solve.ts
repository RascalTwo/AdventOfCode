const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	data = data.trim()
	let safeCount = 0;
	for (const line of data.split('\n')) {
		const nums = line.split(' ').map(Number);
		let safe = true
		let dir = null
		for (let i = 0; i < nums.length - 1; i++) {
			if (Math.abs(nums[i] - nums[i + 1]) > 3 || nums[i] - nums[i + 1] === 0) {
				safe = false
				break
			}
			if (!dir) dir = nums[i] > nums[i + 1] ? 'desc' : 'asc'
			else {
				if (dir === 'asc' && nums[i] > nums[i + 1]) {
					safe = false
					break
				}
				else if (dir === 'desc' && nums[i] < nums[i + 1]) {
					safe = false;
					break
				}
			}
		}
		if (safe) safeCount++
	}
	return safeCount
}

function wouldBeSafeByRemovingLevel(nums: number[]) {
	for (let l = 0; l < nums.length; l++) {
		const newNums = [...nums]
		newNums.splice(l, 1)
		let safe = true
		let dir = null
		for (let i = 0; i < newNums.length - 1; i++) {
			if (Math.abs(newNums[i] - newNums[i + 1]) > 3 || newNums[i] - newNums[i + 1] === 0) {
				safe = false
				break
			}
			if (!dir) dir = newNums[i] > newNums[i + 1] ? 'desc' : 'asc'
			else {
				if (dir === 'asc' && newNums[i] > newNums[i + 1]) {
					safe = false
					break
				}
				else if (dir === 'desc' && newNums[i] < newNums[i + 1]) {
					safe = false;
					break
				}
			}
		}
		if (safe) return true;
	}
}

function solveTwo(data: string): any {
	data = data.trim()
	let safeCount = 0;
	for (const line of data.split('\n')) {
		const nums = line.split(' ').map(Number);
		let safe = true
		let dir = null
		for (let i = 0; i < nums.length - 1; i++) {
			if (Math.abs(nums[i] - nums[i + 1]) > 3 || nums[i] - nums[i + 1] === 0) {
				safe = false
				break
			}
			if (!dir) dir = nums[i] > nums[i + 1] ? 'desc' : 'asc'
			else {
				if (dir === 'asc' && nums[i] > nums[i + 1]) {
					safe = false
					break
				}
				else if (dir === 'desc' && nums[i] < nums[i + 1]) {
					safe = false;
					break
				}
			}
		}
		if (safe || wouldBeSafeByRemovingLevel(nums)) safeCount++
	}
	return safeCount
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`), 2);
	console.log(solveOne(data));
})();



(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`), 4);
	console.log(solveTwo(data));
})();
