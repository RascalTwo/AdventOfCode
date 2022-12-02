const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	data = data.replace(/A/g, 'R').replace(/B/g, 'P').replace(/C/g, 'S')
	const values = {
		R: 1,
		P: 2,
		S: 3,
	}
	const scores = data.split('\n').map(line => {
		const [a, wrongB] = line.split(' ');
		const b = {
			X: 'R',
			Y: 'P',
			Z: 'S',
		}[wrongB];
		if (a === b) return 3 + values[b];
		let result;
		if (a === 'R' && b === 'P') result = 'won'
		else if (a === 'R' && b === 'S') result = 'lost'
		else if (a === 'P' && b === 'R') result = 'lost'
		else if (a === 'P' && b === 'S') result = 'won'
		else if (a === 'S' && b === 'R') result = 'won'
		else if (a === 'S' && b === 'P') result = 'lost'

		let score = values[b]
		if (result === 'won') score += 6

		return score;
	})

	return scores.reduce((a, b) => a + b, 0);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`R Y
P X
S Z`), 15);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	data = data.replace(/A/g, 'R').replace(/B/g, 'P').replace(/C/g, 'S')
	const values = {
		R: 1,
		P: 2,
		S: 3,
	}

	const whateverBeats = chosen => {
		if (chosen === 'R') return 'P'
		if (chosen === 'P') return 'S'
		if (chosen === 'S') return 'R'
	}

	const whateverLosesTo = chosen => {
		if (chosen === 'P') return 'R'
		if (chosen === 'S') return 'P'
		if (chosen === 'R') return 'S'
	}
	const scores = data.split('\n').map(line => {
		const [a, wrongB] = line.split(' ');
		const should = {
			X: 'lose',
			Y: 'draw',
			Z: 'win',
		}[wrongB];
		console.log(a, should)
		if (should === 'draw') return 3 + values[a];
		else if (should === 'win') return 6 + values[whateverBeats(a)]
		console.log(a, whateverLosesTo(a))
		return values[whateverLosesTo(a)]
	})
	console.log(scores)
	return scores.reduce((a, b) => a + b, 0);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`R Y
P X
S Z`), 12);
	console.log(solveTwo(data));
})();
