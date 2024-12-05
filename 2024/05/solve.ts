const fs = require('fs');
const assert = require('assert');

function arePagesCorrectlyOrdered(pages: number[], pageOrderingRules: ReturnType<typeof categorizeUpdates>['pageOrderingRules']) {
	const isAfter: number[] = []
	const isBefore = [...pages].reverse()

	return pages.every((page, i) => {
		if (i) isAfter.push(pages[i - 1])
		isBefore.pop()

		const { shouldBeBefore, shouldBeAfter } = pageOrderingRules[page] ?? { shouldBeBefore: [], shouldBeAfter: [] }
		return isAfter.every(after => !shouldBeBefore.has(after)) && isBefore.every(before => !shouldBeAfter.has(before))
	})
}

function sumMiddlePage(updates: number[][]) {
	return updates.map(pages => pages[Math.floor(pages.length / 2)]).reduce((a, b) => a + b, 0)
}

function categorizeUpdates(data: string) {
	const [rawComparisons, rawUpdates] = data.replace(/\r/g, '').split('\n\n')
	const comparisons = rawComparisons.split('\n').map(l => l.split('|').map(Number))
	const pageOrderingRules: Record<string, { shouldBeBefore: Set<number>, shouldBeAfter: Set<number> }> = {};
	for (const [before, after] of comparisons) {
		if (!(before in pageOrderingRules)) pageOrderingRules[before] = { shouldBeBefore: new Set(), shouldBeAfter: new Set() }
		pageOrderingRules[before].shouldBeBefore.add(after)
		if (!(after in pageOrderingRules)) pageOrderingRules[after] = { shouldBeBefore: new Set(), shouldBeAfter: new Set() }
		pageOrderingRules[after].shouldBeAfter.add(before)
	}

	const updates = rawUpdates.split('\n').map(l => l.split(',').map(Number))

	const correct: number[][] = [];
	const incorrect: number[][] = [];
	for (const pages of updates)
		(arePagesCorrectlyOrdered(pages, pageOrderingRules) ? correct : incorrect).push(pages);

	return { correct, incorrect, pageOrderingRules }
}

function solveOne(data: string): any {
	const { correct } = categorizeUpdates(data)
	return sumMiddlePage(correct)
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
	assert.deepStrictEqual(solveOne(data), 6267);
})();


function solveTwo(data: string): any {
	const { incorrect, pageOrderingRules } = categorizeUpdates(data);

	for (const pages of incorrect)
		pages.sort((a, b) => {
			if (pageOrderingRules[a].shouldBeBefore.has(b)) {
				return -1
			}
			if (pageOrderingRules[a].shouldBeAfter.has(b)) {
				return 1
			}
			return 0
		})

	return sumMiddlePage(incorrect)
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
	assert.deepStrictEqual(solveTwo(data), 5184);
})();
