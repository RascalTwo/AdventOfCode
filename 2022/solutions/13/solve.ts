const fs = require('fs');
const assert = require('assert');


function compare(a: any, b: any): boolean | undefined {
	if (typeof a === 'number' && typeof b === 'number') {
		return a > b ? false : a < b ? true : undefined;
	} else if (Array.isArray(a) !== Array.isArray(b)) {
		return compare(Array.isArray(a) ? a : [a], Array.isArray(b) ? b : [b]);
	}

	for (let i = 0, end = Math.max(a.length, b.length); i < end; i++) {
		if (a[i] === undefined) return true;
		if (b[i] === undefined) return false;
		const result = compare(a[i], b[i]);
		if (result !== undefined) return result;
	}
	return undefined;
}


function solveOne(data: string): any {
	let sum = 0;
	for (const [i, lines] of data.split('\n\n').entries()) {
		const [one, two] = lines.split('\n').map(raw => JSON.parse(raw));
		if (compare(one, two)) sum += i + 1;
	}
	return sum;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`), 13);
	console.log(solveOne(data));
})();


function calculateDecoderKey(data: string, ...extraPackets: any): number {
	const packets = [
		...extraPackets,
		...data.trim().split('\n').map(l => l.trim()).filter(Boolean).map(raw => JSON.parse(raw))
	].sort((a, b) => {
		const result = compare(a, b);
		return result === undefined ? 0 : result ? -1 : 1;
	})
	return extraPackets.reduce((product: number, packet: any) => product * (1 + packets.findIndex(p => JSON.stringify(p) === JSON.stringify(packet))), 1);
}


function solveTwo(data: string): any {
	return calculateDecoderKey(data, [[2]], [[6]]);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`), 140);
	console.log(solveTwo(data));
})();
