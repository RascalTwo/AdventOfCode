const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	let good = [];
	function compare(a: any, b: any): boolean | undefined {
		if (typeof a === 'number' && typeof b === 'number') {
			return a > b ? false : a < b ? true : undefined;
		} else if (Array.isArray(a) && Array.isArray(b)) {
			for (let i = 0; i < a.length && i < b.length; i++) {
				const result = compare(a[i], b[i]);
				if (result !== undefined) return result;
			}
			if (a.length > b.length) return false;
			if (a.length < b.length) return true;
			return undefined;
		}
		return compare(Array.isArray(a) ? a : [a], Array.isArray(b) ? b : [b]);
	}

	for (const [i, lines] of data.split('\n\n').entries()) {
		const [one, two] = lines.split('\n').map(raw => JSON.parse(raw));
		if (compare(one, two)) {
			good.push(i + 1);
		}
	}
	return good.reduce((a, b) => a + b, 0);
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


function solveTwo(data: string): any {
	function compare(a: any, b: any): boolean | undefined {
		if (typeof a === 'number' && typeof b === 'number') {
			return a > b ? false : a < b ? true : undefined;
		} else if (Array.isArray(a) && Array.isArray(b)) {
			for (let i = 0; i < a.length && i < b.length; i++) {
				const result = compare(a[i], b[i]);
				if (result !== undefined) return result;
			}
			if (a.length > b.length) return false;
			if (a.length < b.length) return true;
			return undefined;
		}
		return compare(Array.isArray(a) ? a : [a], Array.isArray(b) ? b : [b]);
	}
	const packets = [
		[[2]],
		[[6]],
		...data.trim().split('\n').map(l => l.trim()).filter(Boolean).map(raw => {
			return JSON.parse(raw)
		})
	].sort((a, b) => {
		const result = compare(a, b);
		if (result === undefined) return 0;
		return result ? -1 : 1;
	})
	return (packets.findIndex(p => JSON.stringify(p) === JSON.stringify([[2]])) + 1) * (1 + packets.findIndex(p => JSON.stringify(p) === JSON.stringify([[6]])));
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
