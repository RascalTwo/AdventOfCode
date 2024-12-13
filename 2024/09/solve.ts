const fs = require('fs');
const assert = require('assert');


function solveOne(data: string): any {
	const usedMemory: Record<string, number> = {};
	const freeMemory = []
	let memoryI = 0
	for (let i = 0; i < data.length; i++) {
		const isUsed = i % 2 === 0;
		const size = +data[i];
		for (let m = 0; m < size; m++) {
			if (isUsed) {
				usedMemory[memoryI] = i / 2
			} else {
				freeMemory.push(memoryI)
			}
			memoryI++
		}
	}

	freeMemory.reverse()

	while (freeMemory.length) {
		const firstFree = freeMemory.pop()!
		const lastUsed = Object.keys(usedMemory).at(-1)!;
		usedMemory[firstFree] = usedMemory[lastUsed]
		delete usedMemory[lastUsed]
	}


	const usedKeys = Object.keys(usedMemory)
	let firstFree = -1
	while (usedKeys.at(-1) != usedKeys.length - 1) {
		for (let i = firstFree; i < usedKeys.length; i++) {
			if (!(i in usedMemory)) {
				firstFree = i;
			}
		}
		const lastUsed = usedKeys.pop()!
		usedMemory[firstFree] = usedMemory[lastUsed]
		delete usedMemory[lastUsed]
	}

	let checksum = 0
	for (let i = 0; i < Object.keys(usedMemory).length; i++) {
		checksum += i * usedMemory[i]
	}
	return checksum
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`2333133121414131402`), 1928);
	//console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const usedMemory: Record<number, { loc: number, size: number }> = {};
	const freeMemory: Record<number, number[]> = {}

	let memoryI = 0
	for (let i = 0; i < data.length; i++) {
		const isUsed = i % 2 === 0;
		const size = +data[i];
		if (isUsed) {
			usedMemory[i / 2] = { loc: memoryI, size }
		} else if (size) {
			if (!(size in freeMemory)) freeMemory[size] = [];
			freeMemory[size].push(memoryI)
		}
		memoryI += size
	}

	for (const array of Object.values(freeMemory)) {
		array.sort((a, b) => b - a)
	}

	for (const i of Object.keys(usedMemory).map(Number).sort((a, b) => b - a)) {
		const used = usedMemory[i]

		const free = Object.keys(freeMemory).map(Number).filter(freeSize => freeSize >= used.size).map(size => ({ loc: freeMemory[size].at(-1)!, size })).sort((a, b) => a.loc - b.loc)[0]
		if (!free) continue

		if (used.loc <= free.loc) {
			continue
		}

		usedMemory[i] = { loc: free.loc, size: used.size }
		freeMemory[free.size].pop()
		if (!freeMemory[free.size].length) {
			delete freeMemory[free.size];
		}

		const remainingFree = free.size - used.size

		if (remainingFree) {
			if (!(remainingFree in freeMemory)) freeMemory[remainingFree] = [];
			freeMemory[remainingFree].push(free.loc + used.size)
			freeMemory[remainingFree].sort((a, b) => b - a)
		}
	}

	let rawMemory = {}
	for (const [i, { loc, size }] of Object.entries(usedMemory)) {
		console.log(i)
		for (let o = 0; o < size; o++) {
			rawMemory[loc + o] = i
		}
	}
	let checksum = 0
	for (let i = 0; i <= +Object.keys(rawMemory).at(-1); i++) {
		console.log('c', i)
		if (rawMemory[i] !== undefined) {
			checksum += i * rawMemory[i]
		}
	}
	return checksum
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`2333133121414131402`), 2858);
	//console.log(solveTwo(data));
})();
