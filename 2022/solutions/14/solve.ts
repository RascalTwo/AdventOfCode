const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	const world = new Map();
	for (const coordList of data.split('\n')) {
		let [x, y] = coordList.split(' -> ')[0].split(',').map(Number);
		for (const coord of coordList.split(' -> ').slice(1)) {
			const [x2, y2] = coord.split(',').map(Number);
			while (x !== x2 || y !== y2) {
				world.set(`${x},${y}`, (world.get(`${x},${y}`) || 0) + 1);
				if (x !== x2) {
					x += x < x2 ? 1 : -1;
				}
				if (y !== y2) {
					y += y < y2 ? 1 : -1;
				}
			}
			world.set(`${x},${y}`, (world.get(`${x},${y}`) || 0) + 1);
		}
	}
	const greatestY = Math.max(...Array.from(world.keys()).map((key: string) => Number(key.split(',')[1])));
	sandFalling:
	while (true) {
		let sand = [500, 0]
		while (true) {
			if (sand[1] > greatestY) break sandFalling;
			if (world.get(`${sand[0]},${sand[1]}`) === undefined) {
				world.set(`${sand[0]},${sand[1]}`, 's');
				continue
			}
			if (world.get(`${sand[0]},${sand[1] + 1}`) === undefined) {
				world.delete(`${sand[0]},${sand[1]}`);
				sand[1]++;
				world.set(`${sand[0]},${sand[1]}`, 's');
				continue;
			}
			if (world.get(`${sand[0] - 1},${sand[1] + 1}`) === undefined) {
				world.delete(`${sand[0]},${sand[1]}`);
				sand[0]--;
				sand[1]++;
				world.set(`${sand[0]},${sand[1]}`, 's');
				continue;
			}
			if (world.get(`${sand[0] + 1},${sand[1] + 1}`) === undefined) {
				world.delete(`${sand[0]},${sand[1]}`);
				sand[0]++;
				sand[1]++;
				world.set(`${sand[0]},${sand[1]}`, 's');
				continue;
			}
			break;
		}
	}

	return [...world.values()].filter((value: any) => value === 's').length - 1;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`), 24);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const world = new Map();
	for (const coordList of data.split('\n')) {
		let [x, y] = coordList.split(' -> ')[0].split(',').map(Number);
		for (const coord of coordList.split(' -> ').slice(1)) {
			const [x2, y2] = coord.split(',').map(Number);
			while (x !== x2 || y !== y2) {
				world.set(`${x},${y}`, (world.get(`${x},${y}`) || 0) + 1);
				if (x !== x2) {
					x += x < x2 ? 1 : -1;
				}
				if (y !== y2) {
					y += y < y2 ? 1 : -1;
				}
			}
			world.set(`${x},${y}`, (world.get(`${x},${y}`) || 0) + 1);
		}
	}
	const greatestY = Math.max(...Array.from(world.keys()).map((key: string) => Number(key.split(',')[1])));

	for (let x = -10000; x < 10000; x++) {
		world.set(`${x},${greatestY + 2}`, 'f');
	}
	while (true) {
		let sand = [500, 0]
		if (world.get(`${sand[0]},${sand[1]}`) === 's') break;
		while (true) {
			if (world.get(`${sand[0]},${sand[1]}`) === undefined) {
				world.set(`${sand[0]},${sand[1]}`, 's');
				continue
			}
			if (world.get(`${sand[0]},${sand[1] + 1}`) === undefined) {
				world.delete(`${sand[0]},${sand[1]}`);
				sand[1]++;
				world.set(`${sand[0]},${sand[1]}`, 's');
				continue;
			}
			if (world.get(`${sand[0] - 1},${sand[1] + 1}`) === undefined) {
				world.delete(`${sand[0]},${sand[1]}`);
				sand[0]--;
				sand[1]++;
				world.set(`${sand[0]},${sand[1]}`, 's');
				continue;
			}
			if (world.get(`${sand[0] + 1},${sand[1] + 1}`) === undefined) {
				world.delete(`${sand[0]},${sand[1]}`);
				sand[0]++;
				sand[1]++;
				world.set(`${sand[0]},${sand[1]}`, 's');
				continue;
			}
			break;
		}
	}
	return [...world.values()].filter((value: any) => value === 's').length;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	/*assert.deepStrictEqual(solveTwo(`498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`), 93);*/
	console.log(solveTwo(data));
})();
