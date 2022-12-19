const fs = require('fs');
const assert = require('assert');

function* generateTouchingCubes(x: number, y: number, z: number): Generator<[number, number, number]> {
	for (let dx = -1; dx <= 1; dx++) {
		for (let dy = -1; dy <= 1; dy++) {
			for (let dz = -1; dz <= 1; dz++) {
				const dist = Math.abs(dx) + Math.abs(dy) + Math.abs(dz);
				if (dist === 1) yield [x + dx, y + dy, z + dz];
			}
		}
	}
}

function solveOne(data: string): any {
	const cubes = new Set<string>(data.split('\n'));

	let exposedFaces = 0;
	for (const cube of cubes) {
		for (const [nx, ny, nz] of generateTouchingCubes(...cube.split(',').map(Number) as [number, number, number])) {
			if (!cubes.has(`${nx},${ny},${nz}`)) exposedFaces++;
		}
	}
	return exposedFaces;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`1,1,1
2,1,1`), 10);
	assert.deepStrictEqual(solveOne(`2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`), 64);
	console.log(solveOne(data));
})();



function solveTwo(data: string): any {
	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;
	let minZ = Infinity;
	let maxZ = -Infinity;
	const cubes = new Set<string>(data.split('\n').map(cube => {
		const [x, y, z] = cube.split(',').map(Number);
		minX = Math.min(minX, x);
		maxX = Math.max(maxX, x);
		minY = Math.min(minY, y);
		maxY = Math.max(maxY, y);
		minZ = Math.min(minZ, z);
		maxZ = Math.max(maxZ, z);
		return cube;
	}));

	const visited = new Set<string>();

	let exposedFaces = 0;
	const stack = [[minX - 1, minY - 1, minZ - 1]];
	while (stack.length) {
		const [x, y, z] = stack.pop()!;
		const cube = `${x},${y},${z}`;

		if (visited.has(cube)) continue;
		visited.add(cube);

		for (const [nx, ny, nz] of generateTouchingCubes(x, y, z)) {
			if (nx < minX - 1 || nx > maxX + 1 || ny < minY - 1 || ny > maxY + 1 || nz < minZ - 1 || nz > maxZ + 1) continue;

			const key = `${nx},${ny},${nz}`;
			if (cubes.has(key)) exposedFaces++
			else if (!visited.has(key)) stack.push([nx, ny, nz]);
		}
	}

	return exposedFaces;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`), 58);
	console.log(solveTwo(data));
})();
