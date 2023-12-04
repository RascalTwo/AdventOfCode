// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');


const winningNumbersToScore = (winningNumbers: number) => {
	let score = +!!winningNumbers
	for (let i = 1; i < winningNumbers; i++) score *= 2;
	return score;
}

const parseCards = (data: string) => data.trim().split('\n').map(line => {
	const id = +line.split(/\s+/)[1].split(':')[0];
	const [winningNumbersArray, numbersHad] = line.split(': ')[1].split('|')
		.map(group => group.trim().split(/\s+/).map(Number));
	const winningNumbers = new Set(winningNumbersArray);

	return { id, numbersWon: numbersHad.reduce((a, b) => a + +winningNumbers.has(b), 0) }
});

function solveOne(data: string): any {
	return parseCards(data)
		.reduce((a, b) => a + winningNumbersToScore(b.numbersWon), 0)
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
	const cards = parseCards(data);

	const counts = cards.reduce((a, b) => ({ ...a, [b.id]: 1 }), {} as Record<number, number>);
	for (const card of cards)
		for (let i = card.id + 1; i <= card.id + card.numbersWon; i++)
			counts[i] += counts[card.id]

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
