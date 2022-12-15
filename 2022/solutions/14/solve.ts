const fs = require('fs');
const assert = require('assert');



function placeWalls(data: string, floor = false): [Map<string, '#' | 'o'>, number] {
	let greatestY = -Infinity;

	const world = new Map<string, '#' | 'o'>();
	for (const coordList of data.split('\n')) {
		const coords = coordList.split(' -> ').map(rawCoord => rawCoord.split(',').map(Number));
		let [x, y] = coords[0];
		world.set(`${x},${y}`, '#');
		for (const [x2, y2] of coords.slice(1)) {
			if (y2 > greatestY) greatestY = y2;
			while (x !== x2 || y !== y2) {
				if (x !== x2) x += x < x2 ? 1 : -1;
				else if (y !== y2) y += y < y2 ? 1 : -1;
				world.set(`${x},${y}`, '#');
			}
		}
	}

	if (floor) {
		greatestY += 2;
		for (let x = -1000; x < 1000; x++) world.set(`${x},${greatestY}`, '#');
	}

	return [ world, greatestY ];
}

function simulateSand(world: Map<string, '#' | 'o'>, greatestY: number) {
	sandFalling:
	while (true) {
		let [x, y] = [500, 0];
		if (world.get(`${x},${y}`) === 'o') break;
		while (true) {
			if (y >= greatestY) {
				world.delete(`${x},${y}`);
				break sandFalling;
			}
			else if (world.get(`${x},${y}`) === undefined) {
				world.set(`${x},${y}`, 'o');
			}
			else if (world.get(`${x},${y + 1}`) === undefined) {
				world.delete(`${x},${y}`);
				y++;
				world.set(`${x},${y}`, 'o');
			}
			else if (world.get(`${x - 1},${y + 1}`) === undefined) {
				world.delete(`${x},${y}`);
				x--;
				y++;
				world.set(`${x},${y}`, 'o');
			}
			else if (world.get(`${x + 1},${y + 1}`) === undefined) {
				world.delete(`${x},${y}`);
				x++;
				y++;
				world.set(`${x},${y}`, 'o');
			} else break;
		}
	}

	return [...world.values()].filter((value: any) => value === 'o').length
}

function solveOne(data: string): any {
	return simulateSand(...placeWalls(data, false));
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`), 24);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	return simulateSand(...placeWalls(data, true));
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`), 93);
	//console.log(solveTwo(data));
})();
