const fs = require('fs');
const assert = require('assert');

function simulateCRT(data: string): [number, string] {
	let cycle = 0;
	let x = 1;

	let output = '';
	const strengths: number[] = [];

	incrementCycle()

	function incrementCycle() {
		const horizontalPosition = cycle % 40;
		if (cycle && horizontalPosition === 0) output += '\n';
		output += Math.abs(x - horizontalPosition) < 2 ? '█' : ' ';

		cycle++;

		for (let attempt = 20; attempt <= cycle; attempt += 40){
			if (cycle === attempt) {
				strengths.push(cycle * x);
				break;
			}
		}
	}

	for (const inst of data.trim().split('\n')) {
		const [command, arg] = inst.split(' ');
		if (command === 'noop') incrementCycle();
		else if (command === 'addx') {
			incrementCycle();
			x += +arg;
			incrementCycle();
		}
	}

	return [
		strengths.reduce((a, b) => a + b, 0),
		output.slice(0, -2)
	];
}

function solveOne(data: string): any {
	return simulateCRT(data)[0];
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`), 13140);
	console.log(solveOne(data));
})();


function solveTwo(data: string) {
	return simulateCRT(data)[1];
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`),
		'██  ██  ██  ██  ██  ██  ██  ██  ██  ██  \n' +
		'███   ███   ███   ███   ███   ███   ███ \n' +
		'████    ████    ████    ████    ████    \n' +
		'█████     █████     █████     █████     \n' +
		'██████      ██████      ██████      ████\n' +
		'███████       ███████       ███████     ');
	console.log(solveTwo(data));
})();
