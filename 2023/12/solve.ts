// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');


const memoize = (func: (...args: any[]) => any) => {
	const cache = new Map();
	return (...args: any[]) => {
		const key = JSON.stringify(args);
		if (cache.has(key))
			return cache.get(key);

		const value = func(...args);
		cache.set(key, value);
		return value;
	};
};

const lineToLavaAndSprings = (line: string): [string, number[]] => {
	const [lava, springs] = line.split(' ')
	return [lava, springs.split(',').map(Number)]
}

const waysToArrange = memoize((lava: string, springs: number[]): number => {
	if (!lava.length)
		return +(springs.length === 0)

	if (!springs.length)
		return lava.includes('#') ? 0 : 1;

	if (lava.length < springs.reduce((a, b) => a + +b, 0) + springs.length - 1)
		return 0;


	const nextLava = lava.indexOf('#');
	const nextPossible = lava.indexOf('?');
	switch (lava[0]) {
		case '.': {
			let forward = 1;
			if (nextLava !== -1) forward = nextLava;
			if (nextPossible !== -1) forward = Math.min(forward, nextPossible);
			return waysToArrange(lava.slice(forward), springs);
		}
		case '?': {
			const restOfLava = lava.slice(1)
			return waysToArrange('#' + restOfLava, springs) + waysToArrange('.' + restOfLava, springs);
		}
		case '#': {
			const current = springs[0]
			if (lava[current] === '#' || lava.slice(0, current).includes('.'))
				return 0

			return waysToArrange(lava.slice(current + 1), springs.slice(1));
		}
		default: throw new Error('unreachable')
	}
})


assert.deepStrictEqual(waysToArrange(...lineToLavaAndSprings('???.### 1,1,3')), 1);
assert.deepStrictEqual(waysToArrange(...lineToLavaAndSprings('.??..??...?##. 1,1,3')), 4);
assert.deepStrictEqual(waysToArrange(...lineToLavaAndSprings('?#?#?#?#?#?#?#? 1,3,1,6')), 1);
assert.deepStrictEqual(waysToArrange(...lineToLavaAndSprings('????.#...#... 4,1,1')), 1);
assert.deepStrictEqual(waysToArrange(...lineToLavaAndSprings('????.######..#####. 1,6,5')), 4);
assert.deepStrictEqual(waysToArrange(...lineToLavaAndSprings('?###???????? 3,2,1')), 10);

function solveOne(data: string): any {
	let total = 0;
	for (const line of data.trim().split('\n')) {
		total += waysToArrange(...lineToLavaAndSprings(line));
	}
	return total
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`), 21);
	console.log(solveOne(data));
})();

const unfoldLavaAndSprings = (lava: string, springs: number[]): [string, number[]] => {
	const newLava = (lava + '?').repeat(5).slice(0, -1);

	let newSprings = [...springs]
	for (let i = 1; i < 5; i++) {
		newSprings = [...newSprings, ...springs]
	}

	return [newLava, newSprings]
}

assert.deepStrictEqual(unfoldLavaAndSprings('.#', [1]), ['.#?.#?.#?.#?.#', [1, 1, 1, 1, 1]]);
assert.deepStrictEqual(unfoldLavaAndSprings('???.###', [1, 1, 3]), ['???.###????.###????.###????.###????.###', [1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3]]);

function solveTwo(data: string): any {
	let total = 0;
	for (const line of data.trim().split('\n')) {
		total += waysToArrange(...unfoldLavaAndSprings(...lineToLavaAndSprings(line)));
	}
	return total
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`), 525152);
	console.log(solveTwo(data));
})();
