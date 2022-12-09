const fs = require('fs');
const assert = require('assert');


const DIRECTION_TO_VELOCITY = {
	R: [0, 1],
	L: [0, -1],
	U: [1, 0],
	D: [-1, 0]
} as const;

const DIMENSIONS = 2;


function areNeighbors(head: [number, number], tail: [number, number]) {
	return Math.abs(head[0] - tail[0]) <= 1 && Math.abs(head[1] - tail[1]) <= 1;
}

function simulateRope(data: string, length: number) {
	const rope = Array.from({ length }, () => [0, 0] as [number, number]);
	const tailVisited = new Set();

	for (const [, direction, count] of data.matchAll(/([RLUD]) (\d+)/g)) {
		const [dx, dy] = DIRECTION_TO_VELOCITY[direction as "R" | "L" | "U" | "D"];
		for (let i = 0; i < +count; i++) {
			const [hx, hy] = rope[0];
			rope[0] = [hx + dx, hy + dy];

			for (let j = 1; j < rope.length; j++) {
				const prev = rope[j - 1], current = rope[j];

				while (!areNeighbors(prev, current)) {
					for (let k = 0; k < DIMENSIONS; k++){
						if (Math.abs(prev[k] - current[k]) > 0) {
							current[k] += Math.sign(prev[k] - current[k]);
						}
					}
				}

				tailVisited.add(rope.at(-1)!.join(','));
			}
		}
	}

	return tailVisited.size;
}


function solveOne(data: string): any {
	return simulateRope(data, 2);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`), 13);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	return simulateRope(data, 10);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`), 1);
	assert.deepStrictEqual(solveTwo(`R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`), 36);
	console.log(solveTwo(data));
})();
