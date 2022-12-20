const fs = require('fs');
const assert = require('assert');


function solveOne(data: string): any {
	let nums = data.split('\n').map((s, i) => ({
		num: parseInt(s),
		foundIndex: i,
	}));
	const numsByIndex = nums.reduce((acc, n) => {
		acc[n.foundIndex] = n;
		return acc;
	}, {} as any);

	for (let i = 0; i < nums.length; i++) {
		const numObj = numsByIndex[i];
		const currentIndex = nums.indexOf(numObj);
		nums.splice(currentIndex, 1);
		nums.splice((currentIndex + numObj.num) % nums.length, 0, numObj);
	}

	let groveCoords = [];

	const zeroIndex = nums.findIndex(n => n.num === 0);

	let i = zeroIndex;
	for (let n = 0; n < 1000; n++){
		i++
		if (i >= nums.length) i = 0;
	}
	groveCoords.push(nums[i].num)

	for (let n = 0; n < 1000; n++){
		i++
		if (i >= nums.length) i = 0;
	}
	groveCoords.push(nums[i].num)

	for (let n = 0; n < 1000; n++){
		i++
		if (i >= nums.length) i = 0;
	}
	groveCoords.push(nums[i].num)
	return groveCoords.reduce((acc, n) => acc + n, 0)
}

// 13884
(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`1
2
-3
3
-2
0
4`), 3);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	let nums = data.split('\n').map((s, i) => ({
		num: parseInt(s) * 811589153,
		foundIndex: i,
	}));
	const numsByIndex = nums.reduce((acc, n) => {
		acc[n.foundIndex] = n;
		return acc;
	}, {} as any);

	for (let m = 0; m < 10; m++){
		for (let i = 0; i < nums.length; i++) {
			const numObj = numsByIndex[i];
			const currentIndex = nums.indexOf(numObj);
			nums.splice(currentIndex, 1);
			nums.splice((currentIndex + numObj.num) % nums.length, 0, numObj);
		}
	}

	let groveCoords = [];

	const zeroIndex = nums.findIndex(n => n.num === 0);

	let i = zeroIndex;
	for (let n = 0; n < 1000; n++){
		i++
		if (i >= nums.length) i = 0;
	}
	groveCoords.push(nums[i].num)

	for (let n = 0; n < 1000; n++){
		i++
		if (i >= nums.length) i = 0;
	}
	groveCoords.push(nums[i].num)

	for (let n = 0; n < 1000; n++){
		i++
		if (i >= nums.length) i = 0;
	}
	groveCoords.push(nums[i].num)
	return groveCoords.reduce((acc, n) => acc + n, 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`1
2
-3
3
-2
0
4`), 1623178306);
	console.log(solveTwo(data));
})();
