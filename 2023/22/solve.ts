const fs = require('fs');
const assert = require('assert');



const tupleToXYZ = (tuple: number[]) => ({
	x: tuple[0],
	y: tuple[1],
	z: tuple[2],
});

type Coord = { x: number, y: number, z: number };

type Cube = { index: number, start: Coord, end: Coord, ranges: { x: [number, number], y: [number, number], z: [number, number] } };

function areCubesIntersecting(a: Cube, b: Cube) {
	return (
		a.start.x <= b.end.x && a.end.x >= b.start.x &&
		a.start.y <= b.end.y && a.end.y >= b.start.y &&
		a.start.z <= b.end.z && a.end.z >= b.start.z
	);
}

const moveCube = (cube: Cube, change: Coord): Cube => {
	const start = {
		x: cube.start.x + change.x,
		y: cube.start.y + change.y,
		z: cube.start.z + change.z,
	}
	const end = {
		x: cube.end.x + change.x,
		y: cube.end.y + change.y,
		z: cube.end.z + change.z,
	}
	return {
		index: cube.index,
		start,
		end,
		ranges: {
			x: [Math.min(start.x, end.x), Math.max(start.x, end.x)],
			y: [Math.min(start.y, end.y), Math.max(start.y, end.y)],
			z: [Math.min(start.z, end.z), Math.max(start.z, end.z)],
		},
	};
}

function copyCube(cube: Cube): Cube {
	return {
		index: cube.index,
		start: { ...cube.start },
		end: { ...cube.end },
		ranges: { x: [...cube.ranges.x], y: [...cube.ranges.y], z: [...cube.ranges.z] },
	};
}

function isSupportingAnotherCube(cube: Cube, cubes: Cube[]) {
	cubes.splice(cubes.findIndex(c => c.index === cube.index), 1);
	return tick(cubes);
}

function areCubesEqual(a: Cube, b: Cube) {
	return (
		a.start.x === b.start.x &&
		a.start.y === b.start.y &&
		a.start.z === b.start.z &&
		a.end.x === b.end.x &&
		a.end.y === b.end.y &&
		a.end.z === b.end.z
	);
}

function numberOfBricksCausedToFall(cube: Cube, cubes: Cube[]): number {
	cubes.splice(cubes.findIndex(c => c.index === cube.index), 1);
	const originalCubes = cubes.map(copyCube);

	let cubesMoved = 0;
	cubes.sort((a, b) => a.ranges.z[0] - b.ranges.z[0]);
	for (let c = 0; c < cubes.length; c++) {
		const cube = cubes[c];
		if (cube.ranges.z[0] === 1) continue;
		let z = -1;
		let lowest = null;
		while (true) {
			const downCube = moveCube(cube, { x: 0, y: 0, z });
			let blocked = false;
			for (const otherCube of cubes) {
				if (otherCube === cube) continue;
				if (areCubesIntersecting(downCube, otherCube)) {
					blocked = true;
					break;
				}
			}
			if (blocked) break
			z--;
			lowest = downCube;
			if (downCube.ranges.z[0] === 1) break;
		}
		if (lowest) {
			cubes.splice(c, 1, lowest);
			cubesMoved++;
		}
	}

	let numberOfMovedBricks = 0;
	for (const cube of cubes) {
		const originalCube = originalCubes.find(c => c.index === cube.index)!;
		numberOfMovedBricks += areCubesEqual(cube, originalCube) ? 0 : 1;
	}
	return numberOfMovedBricks;

}

function tick(cubes: Cube[]) {
	let cubesMoved = false;
	cubes.sort((a, b) => a.ranges.z[0] - b.ranges.z[0]);
	for (let c = 0; c < cubes.length; c++) {
		const cube = cubes[c];
		if (cube.ranges.z[0] === 1) continue;
		let z = -1;
		let lowest = null;
		while (true) {
			const downCube = moveCube(cube, { x: 0, y: 0, z });
			let blocked = false;
			for (const otherCube of cubes) {
				if (otherCube === cube) continue;
				if (areCubesIntersecting(downCube, otherCube)) {
					blocked = true;
					break;
				}
			}
			if (blocked) break
			z--;
			lowest = downCube;
			if (downCube.ranges.z[0] === 1) break;
		}
		if (lowest) {
			cubes.splice(c, 1, lowest);
			cubesMoved = true;
		}
	}
	return cubesMoved;
}

function solveOne(data: string): any {
	const cubes: Cube[] = data.trim().split('\n').map((snapshot, i) => {
		const halves = snapshot.split('~').map(half => half.split(',').map(Number));
		const minX = Math.min(halves[0][0], halves[1][0]);
		const minY = Math.min(halves[0][1], halves[1][1]);
		const minZ = Math.min(halves[0][2], halves[1][2]);
		const maxX = Math.max(halves[0][0], halves[1][0]);
		const maxY = Math.max(halves[0][1], halves[1][1]);
		const maxZ = Math.max(halves[0][2], halves[1][2]);
		return { index: i, start: tupleToXYZ(halves[0]), end: tupleToXYZ(halves[1]), ranges: { x: [minX, maxX], y: [minY, maxY], z: [minZ, maxZ] } }
	});

	let cycles = 0
	while (tick(cubes)) console.log(++cycles)
	let canBeDisintegrated = 0;
	for (const cube of cubes) {
		if (!isSupportingAnotherCube(cube, cubes.map(copyCube))) {
			canBeDisintegrated++;
		}
	}
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
})


function solveTwo(data: string): any {
	const cubes: Cube[] = data.trim().split('\n').map((snapshot, i) => {
		const halves = snapshot.split('~').map(half => half.split(',').map(Number));
		const minX = Math.min(halves[0][0], halves[1][0]);
		const minY = Math.min(halves[0][1], halves[1][1]);
		const minZ = Math.min(halves[0][2], halves[1][2]);
		const maxX = Math.max(halves[0][0], halves[1][0]);
		const maxY = Math.max(halves[0][1], halves[1][1]);
		const maxZ = Math.max(halves[0][2], halves[1][2]);
		return { index: i, start: tupleToXYZ(halves[0]), end: tupleToXYZ(halves[1]), ranges: { x: [minX, maxX], y: [minY, maxY], z: [minZ, maxZ] } }
	});

	let cycles = 0
	while (tick(cubes)) console.log(++cycles)
	let bricksCausedToFall = 0;
	for (const cube of cubes) {
		bricksCausedToFall += numberOfBricksCausedToFall(cube, cubes.map(copyCube));
	}
	return bricksCausedToFall;
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
