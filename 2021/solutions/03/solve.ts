const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): number {
	const numbers = data.trim().split('\n');

	const results = ['', ''];
	for (let i = 0; i < numbers[0].length; i++) Object.entries(
		numbers
			.map(number => number[i] as '0' | '1')
			.reduce((counts, digit) => ({ ...counts, [digit]: counts[digit] + 1 }), { '0': 0, '1': 0 })
	)
		.sort((a, b) => a[1] - b[1])
		.forEach(([char], i) => results[i] += char);

	return results
		.map(result => parseInt(result, 2))
		.reduce((total, number) => total * number);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`), 198);
	console.log(solveOne(data));
})()


function solveTwo(data: string): number {
	const numbers = data.trim().split('\n');

	const results = [];
	for (const lowest of [false, true]) {
		const options = lowest ? '10' : '01';
		let remaining = [...numbers];

		for (let i = 0; i < numbers[0].length; i++) {
			const counts = remaining
				.map(number => [number, number[i]] as [string, '0' | '1'])
				.reduce((counts, [number, digit]) => ({
					...counts,
					[digit]: [...counts[digit], number]
				}), { '0': [], '1': [] });
			remaining = counts[options[Number(counts[1].length >= counts[0].length)] as '0' | '1'];
			if (remaining.length === 1) break;
		}
		results.push(remaining[0]);
	}

	return results
		.map(result => parseInt(result, 2))
		.reduce((total, number) => total * number);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`), 230);
	console.log(solveTwo(data));
})();
