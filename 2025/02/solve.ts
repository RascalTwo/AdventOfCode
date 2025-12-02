const fs = require('fs');
const assert = require('assert');


function solve(data: string, calcMinimumChunkSize: (id: string)  => number): any{
	const invalidIDs = new Set<number>();
	for (const [first, last] of data.trim().split(',').map(range => range.split('-').map(Number))){
		for (let currentId = first; currentId <= last; currentId++){
			if (currentId < 10) continue;

			const idString = currentId.toString();
			const halfwayPoint = Math.ceil(idString.length / 2)
			for (let chunkSize = calcMinimumChunkSize(idString); chunkSize <= halfwayPoint; chunkSize++){
				const chunk = idString.slice(0, chunkSize);
				const invalidId = chunk.repeat(idString.length / chunk.length);
				if (invalidId === idString) {
					invalidIDs.add(currentId)
				}
			}
		}
	}
	return [...invalidIDs].reduce((a, b) => a + b, 0)
}

function solveOne(data: string): any{
	return solve(data, id => Math.ceil(id.length / 2));
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual([11, 22, 99, 1010, 1188511885, 222222, 446446, 38593859].reduce((a, b) => a + b), 1227775554)
	assert.deepStrictEqual(solveOne(`11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`), 1227775554);
	console.log(solveOne(data));
})();

function solveTwo(data: string): any{
	return solve(data, id => 1);
}



(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`), 4174379265);
	console.log(solveTwo(data));
})();

export {};