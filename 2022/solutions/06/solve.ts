const fs = require('fs');
const assert = require('assert');


function solve(signal: string, distinctCount: number){
	for (let i = 0; i <= signal.length - distinctCount; i++) {
		if (new Set(signal.substring(i, i + distinctCount)).size === distinctCount) {
			return i + distinctCount;
		}
	}
}


function solveOne(data: string): any {
	return solve(data, 4);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`mjqjpqmgbljsphdztnvjfqwrcgsmlb`), 7);
	assert.deepStrictEqual(solveOne(`bvwbjplbgvbhsrlpgdmjqwftvncz`), 5);
	assert.deepStrictEqual(solveOne(`nppdvjthqldpwncqszvftbrmjlhg`), 6);
	assert.deepStrictEqual(solveOne(`nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`), 10);
	assert.deepStrictEqual(solveOne(`zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`), 11);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	return solve(data, 14);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`mjqjpqmgbljsphdztnvjfqwrcgsmlb`), 19);
	assert.deepStrictEqual(solveTwo(`bvwbjplbgvbhsrlpgdmjqwftvncz`), 23);
	assert.deepStrictEqual(solveTwo(`nppdvjthqldpwncqszvftbrmjlhg`), 23);
	assert.deepStrictEqual(solveTwo(`nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`), 29);
	assert.deepStrictEqual(solveTwo(`zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`), 26);
	console.log(solveTwo(data));
})();
