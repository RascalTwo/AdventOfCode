// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');

const orderStringByFrequency = (string: string) => {
	const chars = [...string]
	const counts = chars.reduce((counts, char) => {
		if (!(char in counts)) counts[char] = 0;
		counts[char]++;
		return counts;
	}, {} as Record<string, number>)
	return chars.sort((a, b) => counts[b] - counts[a] || a.localeCompare(b)).join('');
}

type CardType = 'FIVE_OF_KIND' | 'FOUR_OF_KIND' | 'FULL_HOUSE' | 'THREE_OF_KIND' | 'TWO_PAIR' | 'ONE_PAIR' | 'HIGH_PAIR'

const CARD_TYPES = ['HIGH_PAIR', 'ONE_PAIR', 'TWO_PAIR', 'THREE_OF_KIND', 'FULL_HOUSE', 'FOUR_OF_KIND', 'FIVE_OF_KIND']
const typeToStrength = (type: CardType) => CARD_TYPES.indexOf(type)

const STRENGTHS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const WILD_JOKERS_STRENGTH = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']

const handToBestStrength = (hand: string) => {
	let bestStrength = Number.MIN_SAFE_INTEGER
	const pool = [hand];
	while (pool.length) {
		const hand = pool.pop()!
		for (const char of WILD_JOKERS_STRENGTH.slice(0, -1)) {
			const newHand = hand.replace('J', char);
			if (newHand.includes('J')) pool.push(newHand)
			else bestStrength = Math.max(bestStrength, typeToStrength(handToType(newHand)))
		}
	}
	return bestStrength
}


const CARD_TYPE_REGEXES: [RegExp, CardType][] = [
	[/(.)\1\1\1\1/, 'FIVE_OF_KIND'],
	[/(.)\1\1\1/, 'FOUR_OF_KIND'],
	[/(.)\1\1(.)\2/, 'FULL_HOUSE'],
	[/(.)\1\1/, 'THREE_OF_KIND'],
	[/(.)\1(.)\2/, 'TWO_PAIR'],
	[/(.)\1/, 'ONE_PAIR'],
]
const handToType = (hand: string): CardType => {
	const orderedHand = orderStringByFrequency(hand);

	for (const [regex, type] of CARD_TYPE_REGEXES) {
		if (regex.test(orderedHand)) return type;
	}

	return 'HIGH_PAIR'
}
assert.deepStrictEqual(handToType('AAAAA'), 'FIVE_OF_KIND')
assert.deepStrictEqual(handToType('AA8AA'), 'FOUR_OF_KIND')
assert.deepStrictEqual(handToType('23332'), 'FULL_HOUSE')
assert.deepStrictEqual(handToType('TTT98'), 'THREE_OF_KIND')
assert.deepStrictEqual(handToType('23432'), 'TWO_PAIR')
assert.deepStrictEqual(handToType('A23A4'), 'ONE_PAIR')
assert.deepStrictEqual(handToType('23456'), 'HIGH_PAIR')

const handToStrength = (hand: string) => typeToStrength(handToType(hand))


function solve(data: string, wildJokers: boolean) {
	return data.trim().split('\n').map(line => {
		const [hand, bid] = line.split(' ')
		return {
			hand,
			bid: +bid,
			strength: wildJokers ? handToBestStrength(hand) : handToStrength(hand)
		}
	}).sort((a, b) => {
		if (a.strength !== b.strength) return a.strength - b.strength;

		for (let i = 0; i < 5; i++) {
			const aStr = STRENGTHS.indexOf(a.hand[i]);
			const bStr = STRENGTHS.indexOf(b.hand[i]);
			if (aStr !== bStr) return bStr - aStr;
		}

		return 0;
	}).reduce((winnings, card, i) => winnings + (card.bid * (i + 1)), 0)
}

function solveOne(data: string): any {
	return solve(data, false);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`), 6440);
	console.log(solveOne(data));
})()


function solveTwo(data: string): any {
	return solve(data, true);
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
