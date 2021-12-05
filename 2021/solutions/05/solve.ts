const fs = require('fs');
const assert = require('assert');



function solve(data: string, diagnals: boolean): number {
	const world: Record<string, number> = {};

	for (const line of data.trim().split('\n')) {
		const [start, end] = line.split(' -> ').map(side => {
			const [x, y] = side.split(',').map(Number);
			return { x, y };
		})
		if (!diagnals && start.x !== end.x && start.y !== end.y) continue;

		const delta = (['x', 'y'] as Array<'x' | 'y'>).reduce((delta, dimension) => ({
			...delta,
			[dimension]: Math.sign(start[dimension] === end[dimension] ? 0 : end[dimension] - start[dimension])
		}), { x: 0, y: 0 });

		const stop = JSON.stringify({ x: end.x + delta.x, y: end.y + delta.y });
		for (let current = start; JSON.stringify(current) !== stop; current = { x: current.x + delta.x, y: current.y + delta.y }) {
			const loc = `${current.x},${current.y}`;
			if (!(loc in world)) world[loc] = 0;
			world[loc] += 1;
		}
	}

	return Object.values(world).filter(count => count > 1).length;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solve(`0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`, false), 5);
	console.log(solve(data, false));
})();

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solve(`0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`, true), 12);
	console.log(solve(data, true));
})();
