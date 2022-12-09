const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any{
	let head = [0, 0]
	let tail = [0, 0]
	function isTailTouching(){
		const headNeighborCoordinatesIncludingDiagnals = [
			[head[0] + 1, head[1]],
			[head[0] - 1, head[1]],
			[head[0], head[1] + 1],
			[head[0], head[1] - 1],
			[head[0] + 1, head[1] + 1],
			[head[0] + 1, head[1] - 1],
			[head[0] - 1, head[1] + 1],
			[head[0] - 1, head[1] - 1],
			[head[0], head[1]]
		]
		return headNeighborCoordinatesIncludingDiagnals.some(([x,y]) => tail[0] === x && tail[1] === y);
	}

	const DIRECTIONS = {
		R: [0,1],
		L: [0,-1],
		U: [1,0],
		D: [-1,0]
	}

	let tailBeen = new Set(['0,0']);

	for (const [direction, rawCount] of data.split('\n').map(line => line.split(' '))){
		const count = +rawCount;
		// @ts-ignore
		const [dx, dy] = DIRECTIONS[direction!]!;
		for (let i = 0; i < count; i++){
			const oldHead = [...head]
			head[0] += dx;
			head[1] += dy;
			if (!isTailTouching()){
				tail = oldHead;
				tailBeen.add(tail.join(','));
			}
		}
	}

	return tailBeen.size
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

// @ts-ignore
function arePointsTouching(head, tail){
	const headNeighborCoordinatesIncludingDiagnals = [
		[head[0] + 1, head[1]],
		[head[0] - 1, head[1]],
		[head[0], head[1] + 1],
		[head[0], head[1] - 1],
		[head[0] + 1, head[1] + 1],
		[head[0] + 1, head[1] - 1],
		[head[0] - 1, head[1] + 1],
		[head[0] - 1, head[1] - 1],
		[head[0], head[1]]
	]
	return headNeighborCoordinatesIncludingDiagnals.some(([x,y]) => tail[0] === x && tail[1] === y);
}

function solveTwo(data: string): any{
	const knots = Array.from({ length: 10 }, () => [0, 0]);
	const seen = new Set();
	const DIRECTIONS = {
		R: [0,1],
		L: [0,-1],
		U: [1,0],
		D: [-1,0]
	}

	for (const [direction, rawCount] of data.split('\n').map(line => line.split(' '))){
		const count = +rawCount;
		// @ts-ignore
		const [dx, dy] = DIRECTIONS[direction!]!;
		for (let i = 0; i < count; i++){
			const [hx, hy] = knots[0];
			knots[0] = [hx + dx, hy + dy];

			for (let j = 1; j < knots.length; j++){
				const prev = knots[j - 1];
				const current = knots[j];
				while (!arePointsTouching(prev, current)) {
					if (Math.abs(prev[0] - current[0]) > 0) {
						current[0] += Math.sign(prev[0] - current[0]);
					}
					if (Math.abs(prev[1] - current[1]) > 0) {
						current[1] += Math.sign(prev[1] - current[1]);
					}
				}
				seen.add(knots[9].join(','));
			}
		}
	}

	return seen.size
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
