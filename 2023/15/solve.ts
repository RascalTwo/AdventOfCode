// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');

type Lens = { label: string, focalLength: number }

function hash(step: string): number {
	let value = 0;
	for (let i = 0; i < step.length; i++)
		value = ((value + step.charCodeAt(i)) * 17) % 256
	return value
}
assert.deepStrictEqual(hash('HASH'), 52);

function solveOne(data: string): any {
	return data.trim().split(',')
		.map(hash)
		.reduce((a, b) => a + b, 0);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`), 1320);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const boxes: Lens[][] = Array.from({ length: 256 }, () => []);
	for (const step of data.trim().split(',')) {
		const operation = step.match(/=|-/)![0];
		const label = step.split(operation)[0];
		const box = boxes[hash(label)];
		const existingIndex = box.findIndex(lens => lens.label === label)
		if (operation === '=') {
			const lens = { label, focalLength: parseInt(step.split(operation)[1]) }
			if (existingIndex === -1)
				box.push(lens);
			else
				box.splice(existingIndex, 1, lens);
			continue
		}
		if (existingIndex !== -1) {
			box.splice(existingIndex, 1);
		}
	}

	let totalPower = 0;
	for (const [bi, box] of boxes.entries())
		for (const [li, lens] of box.entries())
			totalPower += (1 + bi) * (li + 1) * lens.focalLength;
	return totalPower;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`), 145);
	console.log(solveTwo(data));
})();
