const fs = require('fs');
const assert = require('assert');


function whoWon(a: 'R' | 'P' | 'S', b: 'R' | 'P' | 'S'): -1 | 0 | 1 {
	if (a === b) return 0;
	if (a === 'R' && b === 'P') return 1;
	if (a === 'R' && b === 'S') return -1;
	if (a === 'P' && b === 'R') return -1;
	if (a === 'P' && b === 'S') return 1;
	if (a === 'S' && b === 'R') return 1;
	if (a === 'S' && b === 'P') return -1;
}

const buildRPSMapper = <R extends string, P extends string, S extends string>(r: R, p: P, s: S) => (char: R | P | S) => ({ [r]: 'R', [p]: 'P', [s]: 'S' }[char] as 'R' | 'P' | 'S');

const opponentToRPS = buildRPSMapper('A', 'B', 'C');
const choiceToRPS = buildRPSMapper('X', 'Y', 'Z');

const VALUES = ' RPS';

function solveOne(data: string): any {
	return [...data.matchAll(/(.) (.)/g)].reduce((sum, [_, a, b]) => {
		const choice = choiceToRPS(b as 'X' | 'Y' | 'Z');
		const choiceValue = VALUES.indexOf(choice);

		const winner = whoWon(opponentToRPS(a as 'A' | 'B' | 'C'), choice);
		const multiplier = winner === -1 ? 0 : winner === 0 ? 1 : 2;

		return sum + choiceValue + (multiplier * 3);
	}, 0);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`A Y
B X
C Z`), 15);
	console.log(solveOne(data));
})();

const RPS = 'RPS';
const XYZ = 'XYZ';

function solveTwo(data: string): any {
	const getChoiceOffset = (char: string, offset: number) => RPS[(RPS.indexOf(char) + offset) % RPS.length];

	return [...data.matchAll(/(.) (.)/g)].reduce((sum, [_, a, b]) => {
		const opponent = opponentToRPS(a as 'A' | 'B' | 'C');
		const myChoice = b === 'Y' ? opponent : getChoiceOffset(opponent, 1 + +(b === 'X'));
		const multiplier = XYZ.indexOf(b);
		return sum + VALUES.indexOf(myChoice) + (multiplier * 3)
	}, 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`A Y
B X
C Z`), 12);
	console.log(solveTwo(data));
})();
