// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');

function hash(step: string): number {
	let value = 0;
	for (const char of step) {
		const asci = char.charCodeAt(0);
		value += asci;
		value *= 17;
		value %= 256
	}
	return value
}

assert.deepStrictEqual(hash('HASH'), 52);
function solveOne(data: string): any {
	const steps = data.trim().split(',');
	return steps.map(step => hash(step)).reduce((a, b) => a + b, 0);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`), 1320);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const steps = data.trim().split(',');
	const boxes: { label: string, focalLength: number }[][] = new Array(256).fill(0).map(() => [])
	for (const step of steps) {
		const label = step.split(/=|-/)[0];
		const focalLength = parseInt(step.split(/=|-/)[1]);
		const boxIndex = hash(label);
		const box = boxes[boxIndex];
		const existingIndex = box.findIndex(lens => lens.label === label)
		if (isNaN(focalLength)) {
			if (existingIndex !== -1) {
				box.splice(existingIndex, 1);
			}
		} else {
			if (existingIndex === -1) {
				box.push({ label, focalLength });
			} else {
				box.splice(existingIndex, 1, { label, focalLength });
			}
		}
	}

	let totalPower = 0;
	for (const [bi, box] of boxes.entries()) {
		for (const [li, lens] of box.entries()) {
			const power = (1 + bi) * (li + 1) * lens.focalLength
			totalPower += power;
		}
	}
	return totalPower;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`), 145);
	console.log(solveTwo(data));
})();
