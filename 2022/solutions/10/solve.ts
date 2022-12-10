const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	let x = 1;
	let cycle = 1;
	const strengths: number[] = [];
	function incCycle() {
		cycle++
		if (cycle === 20) {
			strengths.push(cycle * x);
			return;
		}
		let attempt = 20;
		while (attempt <= cycle) {
			attempt += 40
			if (cycle === attempt) {
				strengths.push(cycle * x);
				break
			}
		}
	}
	for (const inst of data.trim().split('\n')) {
		const [command, ...args] = inst.split(' ');
		if (command === 'noop') {
			incCycle()
		}
		if (command === 'addx') {
			incCycle()
			x += parseInt(args[0]);
			incCycle()
		}
	}
	return strengths.reduce((a, b) => a + b, 0);
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


function solveTwo(data: string): any {
	let x = 1;
	let cycle = 1;
	const strengths: number[] = [];
	let pixels = [];
	function incCycle() {
		const chor = cycle % 40;
		if (Math.abs(x - chor) < 2){
			process.stdout.write('█');
		} else {
			process.stdout.write('.');
		}
		cycle++
		if (chor === 0) console.log();
		if (cycle === 20) {
			strengths.push(cycle * x);
			return;
		}
		let attempt = 20;
		while (attempt <= cycle) {
			attempt += 40
			if (cycle === attempt) {
				strengths.push(cycle * x);
				break
			}
		}
	}
	for (const inst of data.trim().split('\n')) {
		const [command, ...args] = inst.split(' ');
		if (command === 'noop') {
			incCycle()
		}
		if (command === 'addx') {
			incCycle()
			x += parseInt(args[0]);
			incCycle()
		}
	}
	return strengths.reduce((a, b) => a + b, 0);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	console.log(solveTwo(`addx 15
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
noop`));
	console.log(solveTwo(data));
})();
