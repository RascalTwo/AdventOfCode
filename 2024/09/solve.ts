const fs = require('fs');
const assert = require('assert');


function solveOne(data: string): any {
	const usedMemory: Record<string, number> = {};
	const freeMemory = []
	let loc = 0
	for (let i = 0; i < data.length; i++) {
		const size = +data[i];
		for (let _ = 0; _ < size; _++) {
			if (i % 2 === 0) {
				usedMemory[loc] = i / 2
			} else {
				freeMemory.push(loc)
			}
			loc++
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
	console.log(solveOne(data));
})();

function sumInts(start: number, end: number) {
	return (end - start + 1) * (start + end) / 2
}

function solveTwo(data: string): any {
	const usedMemory: Record<number, { loc: number, size: number }> = {};
	const freeMemory: Record<number, number[]> = {}

	let loc = 0
	for (let i = 0; i < data.length; i++) {
		const size = +data[i];
		if (i % 2 === 0) {
			usedMemory[i / 2] = { loc, size }
		} else if (size) {
			if (!(size in freeMemory)) freeMemory[size] = [];
			freeMemory[size].push(loc)
		}
		loc += size
	}
	for (const array of Object.values(freeMemory)) {
		array.sort((a, b) => b - a)
	}

	for (const i of Object.keys(usedMemory).map(Number).sort((a, b) => b - a)) {
		const used = usedMemory[i]

		const free = Object.keys(freeMemory)
			.map(Number)
			.filter(freeSize => freeSize >= used.size)
			.map(size => ({ loc: freeMemory[size].at(-1)!, size }))
			.filter(({ loc }) => loc < used.loc)
			.sort((a, b) => a.loc - b.loc)[0]

		if (!free) continue

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

	let checksum = 0
	for (const [i, { loc, size }] of Object.entries(usedMemory)) {
		checksum += sumInts(loc, loc + size - 1) * +i
	}
	return checksum
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`2333133121414131402`), 2858);
	console.log(solveTwo(data));
})();
