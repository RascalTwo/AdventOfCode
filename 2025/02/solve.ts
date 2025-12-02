const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any{
	const ranges = data.trim().split(',');
	let total= 0
	for (const range of ranges){
		const [first, last] = range.split('-').map(Number)
		let invalid = []
		for (let i = first; i <= last; i++){
			const str = i.toString();
			if (str.length % 2 === 0) {
				const [front, end] = [str.slice(0, str.length / 2), str.slice(str.length / 2)]
				if (front === end) {
					invalid.push(i);
				}
			}
		}
		total += invalid.reduce((a, b) => a + b, 0)
	}
	return total
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual([11, 22, 99, 1010, 1188511885, 222222, 446446, 38593859].reduce((a, b) => a + b), 1227775554)
	assert.deepStrictEqual(solveOne(`11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`), 1227775554);
	console.log(solveOne(data));
})();

function solveTwo(data: string): any{
	const ranges = data.trim().split(',');
	let invalids = new Set<number>();
	for (const range of ranges){
		const [first, last] = range.split('-').map(Number)
		for (let i = first; i <= last; i++){
			const str = i.toString();
			if (str.length === 1) continue
			for (let cs = 1; cs <= str.length / 2; cs++){
				const thing = str.slice(0, cs);
				const times = str.length / thing.length;
				//const big = str.slice(0, cs).repeat(1000).slice(0, str.length);
				const big = str.slice(0, cs).repeat(times);
				if (big === str) {
					invalids.add(i)
				}
			}
		}
	}
	return [...invalids].reduce((a, b) => a + b, 0)
}



(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`), 4174379265);
	console.log(solveTwo(data));
})();

export {};