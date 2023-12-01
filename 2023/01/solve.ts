const fs = require('fs');
const assert = require('assert');


function solveOne(data: string): any {
	const nums = data.trim().split('\n').map(line => {
		const first= line.split('').find(c => c >= '0' && c <= '9')!
		const last = line.split('').reverse().find(c => c >= '0' && c <= '9')!
		return Number(first + last);
	})
	return nums.reduce((a, b) => a + b, 0);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`), 142);
	console.log(solveOne(data));
})();

const wordNums = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

const getFirstNum = (str: string) => {
	let bestIndex = -1;
	let found: string | number = ''
	for (const possible of [...'0123456789'.split(''), 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']) {
		const index = str.indexOf(possible)
		if (bestIndex === -1 && index !== -1) {
			bestIndex = index
			found = possible
		}
		if (index !== -1 && index < bestIndex) {
			bestIndex = index
			found = possible
		}
	}
	if (found.length) found = wordNums.indexOf(found);
	return +found
}

const parseNumsFrom = (string: string) => {
	const num = [];
	for (let i = 0; i < string.length; i++){
		for (const possible of [...'0123456789'.split(''), 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']) {
			if (string.slice(i).startsWith(possible)) {
				if (possible.length > 1) {
					num.push(wordNums.indexOf(possible));
				} else {
					num.push(+possible)
				}
			}
		}
	}
	return num;
}


function solveTwo(data: string): any{
	const nums = data.trim().split('\n').map(line => {
		//const first= getFirstNum(line)
		//const last = getFirstNum(line.split('').reverse().join())
		const nums = parseNumsFrom(line);
		return Number(nums[0] + '' + nums.at(-1));
	})
	return nums.reduce((a, b) => a + b, 0);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`), 281);
	console.log(solveTwo(data));
})();
