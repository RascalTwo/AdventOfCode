const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	const world = new Set<string>();
	const lines = data.split('\n').map(l => l.split(',').map(Number)).forEach(([x, y, z]) => {
		world.add(`${x},${y},${z}`);
	})

	let exposedFaces = 0;
	// iterate through all nine directions from a single coordinate
	for (const cube of world) {
		const [x, y, z] = cube.split(',').map(Number);
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				for (let dz = -1; dz <= 1; dz++) {
					const dist = Math.abs(dx) + Math.abs(dy) + Math.abs(dz);
					if (dist !== 1) continue;
					const neighbor = `${x + dx},${y + dy},${z + dz}`;
					if (!world.has(neighbor)) {
						exposedFaces++;
					}
				}
			}
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
	const world = new Map<string, 'C' | 'E' | 'I'>();
	data.split('\n').map(l => l.split(',').map(Number)).forEach(([x, y, z]) => {
		world.set(`${x},${y},${z}`, 'C');
	})

	// get min x, y, z, and max x, y, z
	let minX = Infinity;
	let minY = Infinity;
	let minZ = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;
	let maxZ = -Infinity;
	for (const cube of world.keys()) {
		const [x, y, z] = cube.split(',').map(Number);
		minX = Math.min(minX, x);
		minY = Math.min(minY, y);
		minZ = Math.min(minZ, z);
		maxX = Math.max(maxX, x);
		maxY = Math.max(maxY, y);
		maxZ = Math.max(maxZ, z);
	}


	function floodFill(world: Map<string, 'C' | 'E' | 'I'>, x: number, y: number, z: number, filling: 'E' | 'I'): void {
		const queue = [[x, y, z]];
		while (queue.length) {
			const [x, y, z] = queue.shift()!;
			const cube = `${x},${y},${z}`;
			world.set(cube, filling);
			for (let dx = -1; dx <= 1; dx++) {
				for (let dy = -1; dy <= 1; dy++) {
					for (let dz = -1; dz <= 1; dz++) {
						const dist = Math.abs(dx) + Math.abs(dy) + Math.abs(dz);
						if (dist !== 1) continue;
						const nx = x + dx;
						const ny = y + dy;
						const nz = z + dz;
						//if outside of the world, skip
						if (nx < minX || nx > maxX || ny < minY || ny > maxY || nz < minZ || nz > maxZ) continue;
						if (!world.has(`${nx},${ny},${nz}`)) queue.push([nx, ny, nz]);
					}
				}
			}
		}
	}

	let exposedFaces = 0;
	function floodSearch(world: Map<string, 'C' | 'E' | 'I'>, x: number, y: number, z: number): void {
		const stack = [[x, y, z]];
		while (stack.length) {
			const [x, y, z] = stack.pop()!;
			const cube = `${x},${y},${z}`;
			if (world.get(cube) === 'E') continue;
			world.set(cube, 'E');
			for (let dx = -1; dx <= 1; dx++) {
				for (let dy = -1; dy <= 1; dy++) {
					for (let dz = -1; dz <= 1; dz++) {
						const dist = Math.abs(dx) + Math.abs(dy) + Math.abs(dz);
						if (dist !== 1) continue;
						const nx = x + dx;
						const ny = y + dy;
						const nz = z + dz;
						//if outside of the world, skip
						const key = `${nx},${ny},${nz}`;

						if (nx < minX - 1 || nx > maxX + 1 || ny < minY - 1 || ny > maxY + 1 || nz < minZ - 1 || nz > maxZ + 1) continue;

						const neighborType = world.get(key);
						if (neighborType === 'C') exposedFaces++
						else if (!neighborType) stack.push([nx, ny, nz]);
					}
				}
			}
		}
	}

	floodSearch(world, minX - 1, minY - 1, minZ - 1);

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
