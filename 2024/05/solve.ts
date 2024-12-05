const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	const [first, second] = data.replace(/\r/g, '').split('\n\n')
	const comparisons = first.split('\n').map(l => l.split('|').map(Number))
	const beforesAndAfters: Record<string, { before: number[], after: number[] }> = {};
	// { 47: { before: [1, 2, 3], after: [5, 6, 7]}}
	for (const [before, after] of comparisons) {
		if (!(before in beforesAndAfters)) beforesAndAfters[before] = { before: [], after: [] }
		beforesAndAfters[before].before.push(after)
		if (!(after in beforesAndAfters)) beforesAndAfters[after] = { before: [], after: [] }
		beforesAndAfters[after].after.push(before)
	}
	const updates = second.split('\n').map(l => l.split(',').map(Number))

	const correctUpdates = updates.filter((pages) => {
		for (let i = 0; i < pages.length; i++) {
			const page = pages[i];
			const isBefore = pages.slice(0, i)
			const isAfter = pages.slice(i + 1)
			const shouldBeBefore = beforesAndAfters[page]?.before
			const shouldBeAfter = beforesAndAfters[page]?.after
			if (shouldBeBefore.some(b4 => isBefore.includes(b4))) {
				return false
			}
			if (shouldBeAfter.some(af => isAfter.includes(af))) {
				return false
			}
		}
		return true;
	})
	return correctUpdates.map(pages => pages[Math.floor(pages.length / 2)]).reduce((a, b) => a + b, 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`), 143);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const [first, second] = data.replace(/\r/g, '').split('\n\n')
	const comparisons = first.split('\n').map(l => l.split('|').map(Number))
	const beforesAndAfters: Record<string, { before: number[], after: number[] }> = {};
	for (const [before, after] of comparisons) {
		if (!(before in beforesAndAfters)) beforesAndAfters[before] = { before: [], after: [] }
		beforesAndAfters[before].before.push(after)
		if (!(after in beforesAndAfters)) beforesAndAfters[after] = { before: [], after: [] }
		beforesAndAfters[after].after.push(before)
	}
	const updates = second.split('\n').map(l => l.split(',').map(Number))

	const inCorrectUpdates = updates.filter((pages) => {
		for (let i = 0; i < pages.length; i++) {
			const page = pages[i];
			const isBefore = pages.slice(0, i)
			const isAfter = pages.slice(i + 1)
			const shouldBeBefore = beforesAndAfters[page]?.before
			const shouldBeAfter = beforesAndAfters[page]?.after
			if (shouldBeBefore.some(b4 => isBefore.includes(b4))) {
				return true
			}
			if (shouldBeAfter.some(af => isAfter.includes(af))) {
				return true
			}
		}
		return false;
	})
	inCorrectUpdates
	inCorrectUpdates.forEach(incorrect => {
		incorrect.sort((a, b) => {
			if (beforesAndAfters[a].before.includes(b)) {
				return -1
			}
			a
			b
			beforesAndAfters[a] //?
			beforesAndAfters[b] //?
			if (beforesAndAfters[a].after.includes(b)) {
				return 1
			}
		})
	})
	const correctOrdered = [
		[97, 75, 47, 61, 53],
		[61, 29, 13],
		[97, 75, 47, 29, 13]
	]

	//inCorrectUpdates
	//const fixedUpdates = inCorrectUpdates.filter((updates, i) => JSON.stringify(updates) === JSON.stringify(correctOrdered[i]))
	//fixedUpdates
	return inCorrectUpdates.map(pages => pages[Math.floor(pages.length / 2)]).reduce((a, b) => a + b, 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`), 123);
	console.log(solveTwo(data));
})();
