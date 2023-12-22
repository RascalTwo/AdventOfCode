const fs = require('fs');
const assert = require('assert');


type Coord = { x: number, y: number, z: number };

type Brick = { index: number, start: Coord, end: Coord, ranges: { x: [number, number], y: [number, number], z: [number, number] } };


const parseBricks = (data: string): Brick[] => data.trim().split('\n').map((snapshot, i) => {
	const halves = snapshot.split('~').map(half => {
		const [x, y, z] = half.split(',').map(Number)
		return { x, y, z }
	});
	const minX = Math.min(halves[0].x, halves[1].x);
	const minY = Math.min(halves[0].y, halves[1].y);
	const minZ = Math.min(halves[0].z, halves[1].z);
	const maxX = Math.max(halves[0].x, halves[1].x);
	const maxY = Math.max(halves[0].y, halves[1].y);
	const maxZ = Math.max(halves[0].z, halves[1].z);
	return { index: i, start: halves[0], end: halves[1], ranges: { x: [minX, maxX], y: [minY, maxY], z: [minZ, maxZ] } }
});

const areBricksIntersecting = (a: Brick, b: Brick) => (
	a.start.x <= b.end.x && a.end.x >= b.start.x &&
	a.start.y <= b.end.y && a.end.y >= b.start.y &&
	a.start.z <= b.end.z && a.end.z >= b.start.z
);

const areBricksEqual = (a: Brick, b: Brick) => (
	a.start.x === b.start.x &&
	a.start.y === b.start.y &&
	a.start.z === b.start.z &&
	a.end.x === b.end.x &&
	a.end.y === b.end.y &&
	a.end.z === b.end.z
);

const copyBrick = (brick: Brick): Brick => ({
	index: brick.index,
	start: { ...brick.start },
	end: { ...brick.end },
	ranges: { x: [...brick.ranges.x], y: [...brick.ranges.y], z: [...brick.ranges.z] },
})

const removeBrick = (brick: Brick, bricks: Brick[]) => bricks.splice(bricks.findIndex(c => c.index === brick.index), 1);

const moveBrick = (brick: Brick, change: Coord): Brick => {
	const start = {
		x: brick.start.x + change.x,
		y: brick.start.y + change.y,
		z: brick.start.z + change.z,
	}
	const end = {
		x: brick.end.x + change.x,
		y: brick.end.y + change.y,
		z: brick.end.z + change.z,
	}
	return {
		index: brick.index,
		start,
		end,
		ranges: {
			x: [Math.min(start.x, end.x), Math.max(start.x, end.x)],
			y: [Math.min(start.y, end.y), Math.max(start.y, end.y)],
			z: [Math.min(start.z, end.z), Math.max(start.z, end.z)],
		},
	};
}

function isSupportingAnotherBrick(brick: Brick, bricks: Brick[]) {
	removeBrick(brick, bricks);
	return tick(bricks);
}


function numberOfBricksCausedToFall(brick: Brick, bricks: Brick[]): number {
	removeBrick(brick, bricks);
	const originalBricks = bricks.map(copyBrick);

	tick(bricks);

	let numberOfMovedBricks = 0;
	for (const brick of bricks)
		numberOfMovedBricks += +!areBricksEqual(brick, originalBricks.find(c => c.index === brick.index)!)
	return numberOfMovedBricks;
}

function tick(bricks: Brick[]) {
	bricks.sort((a, b) => a.ranges.z[0] - b.ranges.z[0]);

	let bricksMoved = false;
	for (let c = 0; c < bricks.length; c++) {
		const brick = bricks[c];
		if (brick.ranges.z[0] === 1) continue;

		let z = -1;
		let lowest = null;
		while (true) {
			const destBrick = moveBrick(brick, { x: 0, y: 0, z });
			let blocked = false;
			for (const otherBrick of bricks) {
				if (otherBrick === brick) continue;
				if (areBricksIntersecting(destBrick, otherBrick)) {
					blocked = true;
					break;
				}
			}
			if (blocked) break

			z--;
			lowest = destBrick;

			if (destBrick.ranges.z[0] === 1) break;
		}

		if (lowest) {
			bricks.splice(c, 1, lowest);
			bricksMoved = true;
		}
	}
	return bricksMoved;
}

function solveOne(data: string): any {
	const bricks = parseBricks(data);

	while (tick(bricks)) { }

	let canBeDisintegrated = 0;
	for (const brick of bricks)
		if (!isSupportingAnotherBrick(brick, bricks.map(copyBrick)))
			canBeDisintegrated++;
	return canBeDisintegrated;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`), 5);
	console.log(solveOne(data));
})();

function solveTwo(data: string): any {
	const bricks = parseBricks(data);

	while (tick(bricks)) { }

	let bricksFallen = 0;
	for (const brick of bricks)
		bricksFallen += numberOfBricksCausedToFall(brick, bricks.map(copyBrick));
	return bricksFallen;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`1,0,1~1,2,1
	0,0,2~2,0,2
	0,2,3~2,2,3
	0,0,4~0,2,4
	2,0,5~2,2,5
	0,1,6~2,1,6
	1,1,8~1,1,9`), 7);
	console.log(solveTwo(data));
})();
