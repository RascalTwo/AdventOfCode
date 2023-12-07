// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');

const toBestHand = (hand: string): [string, number] => {
	if (!hand.includes('J')) return handToType(hand);
	let bestType = ['', Number.MIN_SAFE_INTEGER] as [string, number]
	const pool = [hand];
	while (pool.length) {
		const hand = pool.pop()!
		for (const char of strengths2.slice(0, -1)) {
			const newHand = hand.replace('J', char);
			if (newHand.includes('J')) pool.push(newHand)
			else {
				const type = handToType(newHand)
				if (type[1] > bestType[1]) bestType = type
			}
		}
	}
	return bestType
}

const handToType = (hand: string): [string, number] => {
	const chars = [...hand].sort();
	const counts = chars.reduce((counts, char) => {
		if (!(char in counts)) counts[char] = 0;
		counts[char]++;
		return counts;
	}, {} as Record<string, number>)
	const orderedHand = chars.sort((a, b) => counts[b] - counts[a]).join('');
	if (chars.every(c => c === chars[0])) {
		return ['FIVE_OF_KIND', 7]
	}
	if (/(.)\1\1\1/.test(orderedHand)) {
		return ['FOUR_OF_KIND', 6]
	}
	if (/(.)\1\1(.)\2/.test(orderedHand)) {
		return ['FULL_HOUSE', 5]
	}
	if (/(.)\1\1/.test(orderedHand)) {
		return ['THREE_OF_KIND', 4]
	}
	if (/(.)\1(.)\2/.test(orderedHand)) {
		return ['TWO_PAIR', 3]
	}
	if (/(.)\1/.test(orderedHand)) {
		return ['ONE_PAIR', 2]
	}
	return ['HIGH_PAIR', 1]
}

const strengths = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const strengths2 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']

function solveOne(data: string): any {
	const cards = data.trim().split('\n').map(line => {
		const [hand, bid] = line.split(' ')
		return { hand, bid: +bid, type: handToType(hand) }
	}).sort((a, b) => {
		const at = a.type[1];
		const bt = b.type[1];
		if (at !== bt) return at - bt
		for (let i = 0; i < a.hand.length; i++) {
			const ac = strengths.indexOf(a.hand[i])
			const bc = strengths.indexOf(b.hand[i])
			if (ac === bc) continue;
			return bc - ac
		}
		return 0;
	})

	return cards.reduce((winnings, card, i) => winnings + (card.bid * (i + 1)), 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(handToType('AAAAA'), ['FIVE_OF_KIND', 7])
	assert.deepStrictEqual(handToType('AA8AA'), ['FOUR_OF_KIND', 6])
	assert.deepStrictEqual(handToType('23332'), ['FULL_HOUSE', 5])
	assert.deepStrictEqual(handToType('TTT98'), ['THREE_OF_KIND', 4])
	assert.deepStrictEqual(handToType('23432'), ['TWO_PAIR', 3])
	assert.deepStrictEqual(handToType('A23A4'), ['ONE_PAIR', 2])
	assert.deepStrictEqual(handToType('23456'), ['HIGH_PAIR', 1])
	assert.deepStrictEqual(solveOne(`32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`), 6440);
	console.log(solveOne(data));
})()


function solveTwo(data: string): any {
	const cards = data.trim().split('\n').map(line => {
		const [hand, bid] = line.split(' ')
		return { hand, bid: +bid, type: toBestHand(hand) }
	}).sort((a, b) => {
		const at = a.type[1];
		const bt = b.type[1];
		if (at !== bt) return at - bt
		for (let i = 0; i < a.hand.length; i++) {
			const ac = strengths2.indexOf(a.hand[i])
			const bc = strengths2.indexOf(b.hand[i])
			if (ac === bc) continue;
			return bc - ac
		}
		return 0;
	})

	return cards.reduce((winnings, card, i) => winnings + (card.bid * (i + 1)), 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`), 5905);
	console.log(solveTwo(data));
})();
