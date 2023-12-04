// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');


function solveOne(data: string): any {
	const cards = data.trim().split('\n').map(line => {
		const id = +line.split(/\s+/)[1].split(':')[0];
		const numberGroups = line.split(': ')[1].split('|').map(group => group.trim().split(/\s+/).map(Number))
		const winningNumbers = numberGroups[0];
		const havingNumbers = numberGroups[1];
		const winningNumbersHad = havingNumbers.filter(n => winningNumbers.includes(n));
		let score = 0;
		if (winningNumbersHad.length) score++;
		for (let i = 1; i < winningNumbersHad.length; i++) score *= 2;

		return { id, numberGroups, winningNumbers, havingNumbers, winningNumbersHad, score }
	});


	return cards.reduce((a, b) => a + b.score, 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`), 13);
	console.log(solveOne(data));
})();



function solveTwo(data: string): any {
	const cards = data.trim().split('\n').map(line => {
		const id = +line.split(/\s+/)[1].split(':')[0];
		const numberGroups = line.split(': ')[1].split('|').map(group => group.trim().split(/\s+/).map(Number))
		const winningNumbers = numberGroups[0];
		const havingNumbers = numberGroups[1];
		const winningNumbersHad = havingNumbers.filter(n => winningNumbers.includes(n));
		let score = 0;
		if (winningNumbersHad.length) score++;
		for (let i = 1; i < winningNumbersHad.length; i++) score *= 2;

		return { id, numberGroups, winningNumbers, havingNumbers, winningNumbersHad, score, processed: false }
	});
	const cardsByIds = cards.reduce((a, b) => {
		a[b.id] = b
		return a
	}, {} as any);
	const counts = cards.reduce((a, b) => {
		a[b.id] = 1
		return a
	}, {} as Record<number, number>);
	while (true) {
		let total = cards.length
		for (let c = 0; c < cards.length; c++) {
			const card = cards[c]
			if (card.processed) continue;
			for (let i = card.id + 1; i <= card.id + card.winningNumbersHad.length; i++) {
				//cards.push({ ...cardsByIds[i] })
				//cards.sort((a, b) => a.id - b.id)
				counts[i] += counts[card.id]
			}
			card.processed = true
		}
		if (cards.length === total) break
	}

	return Object.values(counts).reduce((a, b) => a + b, 0)
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`), 30);
	console.log(solveTwo(data));
})();
