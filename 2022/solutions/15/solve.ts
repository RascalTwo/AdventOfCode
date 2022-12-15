const fs = require('fs');
const assert = require('assert');



function solveOne(data: string, scanY: number): any {
	const world = new Map();
	const seenXs = new Set();
	let count = 0;
	for (const line of data.split('\n')) {
		const [sx, sy] = line.match(/x=(-?\d+), y=(-?\d+)/)!.slice(1).map(Number);
		const [bx, by] = line.split('beacon')[1].match(/x=(-?\d+), y=(-?\d+)/)!.slice(1).map(Number);
		if (sy === scanY) {
			world.set(`${sx},${sy}`, 'S');
			seenXs.add(sx);
		}
		if (by === scanY) {
			world.set(`${bx},${by}`, 'B');
			seenXs.add(bx);
		}
		const dist = Math.abs(sx - bx) + Math.abs(sy - by);
		// iterate in a diamond shape around the sensor
		for (let x = sx - dist; x <= sx + dist; x++) {
			// only scan scanY line
			let y = scanY;
			if (y < sy - dist || y > sy + dist) continue;
			//for (let y = sy - dist; y <= sy + dist; y++) {
			if (y !== scanY) continue;
			if (Math.abs(sx - x) + Math.abs(sy - y) <= dist) {
				if (world.has(`${x},${y}`)) continue;
				const key = `${x},${y}`;
				world.set(key, (world.get(key) || 0) + 1);
				if (y === scanY) {
					count++
				}
				//}
			}
		}
	}
	let minY = Infinity;
	let maxY = -Infinity;
	let minX = Infinity;
	let maxX = -Infinity;
	for (const [key] of world) {
		const [x, y] = key.split(',').map(Number);
		minY = Math.min(minY, y);
		maxY = Math.max(maxY, y);
		minX = Math.min(minX, x);
		maxX = Math.max(maxX, x);
	}
	for (let y = minY; y <= maxY; y++) {
		let line = '';
		for (let x = minX; x <= maxX; x++) {
			const key = `${x},${y}`;
			line += world.get(key) || '.';
		}
		//console.log(line);
	}
	return count;
	// return number of beacons that can be seen from the scanY
	/*
	let count = 0;
	for (const [key, value] of world) {
		const [x, y] = key.split(',').map(Number);
		if (y === scanY && value !== 'B' && typeof value === 'number') {
			count++;
		}
	}*/


	return count;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`, 10), 26);
	//console.log(solveOne(data, 2000000));
})();


async function solveTwo(data: string, mxy: number): Promise<any> {
	const ourData = data.split('\n').map(line => {
		const [sx, sy] = line.match(/x=(-?\d+), y=(-?\d+)/)!.slice(1).map(Number);
		const [bx, by] = line.split('beacon')[1].match(/x=(-?\d+), y=(-?\d+)/)!.slice(1).map(Number);
		return { sx, sy, bx, by, dist: Math.abs(sx - bx) + Math.abs(sy - by)};
	});
	const isOutOfRange = (x: number, y: number) => {
		for (const { sx, sy, dist } of ourData) {
			const myDist = Math.abs(sx - x) + Math.abs(sy - y);
			if (myDist <= dist) return false;
		}
		return true;
	}
	//const world = new Map();
	//const found = new Map();
	/*for (const line of data.split('\n')) {
		const [sx, sy] = line.match(/x=(-?\d+), y=(-?\d+)/)!.slice(1).map(Number);
		const [bx, by] = line.split('beacon')[1].match(/x=(-?\d+), y=(-?\d+)/)!.slice(1).map(Number);*/
		//const dist = Math.abs(sx - bx) + Math.abs(sy - by);
		//world.set(`${sx},${sy}`, 'S');
		//world.set(`${bx},${by}`, 'B');
		// iterate over all points in a diamond shape
		/*
		for (let x = sx - dist; x <= sx + dist; x++) {
			for (let y = sy - dist; y <= sy + dist; y++) {
				if (Math.abs(sx - x) + Math.abs(sy - y) <= dist) {
					if (world.has(`${x},${y}`)) continue;
					const key = `${x},${y}`;
					world.set(key, '#');
				}
			}
		}*/


		/*
		for (let dx = 0; dx <= dist + 1; dx++) {
			const dy = dist + 1 - dx;
			for (const xo of [-1, 1]) {
				for (const yo of [-1, 1]) {
					const x = sx + (dx * xo);
					const y = sy + (dy * yo);
					if (x >= 0 && y >= 0 && x <= mxy && y <= mxy) {
						if (isOutOfRange(x, y)) {
							//console.log(x * 4000000 + y)
							//return x * 4000000 + y;
							//console.log({ x, y }, x * 4000000 + y)
							//found.set(x * 4000000 + y, (found.get(x * 4000000 + y) || 0) + 1);
							gotit = x * 4000000 + y;
						}
					}
				}
			}*/
	//}
	/*
			const x = sx + dx;
			const y = sy + dy;
			if (x >= 0 && y >= 0 && x <= mxy && y <= mxy) {
				if (isOutOfRange(x, y)) {
					//console.log(x * 4000000 + y)
					found.set(x * 4000000 + y, (found.get(x * 4000000 + y) || 0) + 1);
				}
			}*/
	//}
	/*
	*/

	function drawWorld() {
		return
		// clear the console
		/*
		console.log('\x1Bc');
		let minY = Infinity;
		let maxY = -Infinity;
		let minX = Infinity;
		let maxX = -Infinity;
		//for (const [key] of world) {
			const [x, y] = key.split(',').map(Number);
			minY = Math.min(minY, y);
			maxY = Math.max(maxY, y);
			minX = Math.min(minX, x);
			maxX = Math.max(maxX, x);
		}
		for (let y = minY; y <= maxY; y++) {
			let line = '';
			for (let x = minX; x <= maxX; x++) {
				const key = `${x},${y}`;
				//line += world.get(key) || ' ';
			}
			console.log(line);
		}*/
	}

	for (const { sx, sy, dist } of ourData) {
		for (const xo of [-1, 1]) {
			for (const yo of [-1, 1]) {
				for (let dx = 0; dx <= dist + 1; dx++) {
					const dy = dist + 1 - dx;
					const x = sx + dx * xo;
					const y = sy + dy * yo;
					//world.set(`${x},${y}`, '-');
					if (x >= 0 && y >= 0 && x <= mxy && y <= mxy) {
						if (isOutOfRange(x, y)) {
							//drawWorld();
							//world.set(`${x},${y}`, 'O');
							//drawWorld();
							///world.set(`${x},${y}`, 'o');
							//isOutOfRange(x, y);
							//console.log({ x, y })
							return x * 4000000 + y
							//found.set(x * 4000000 + y, (found.get(x * 4000000 + y) || 0) + 1);
						}
					}
					//await new Promise(r => setTimeout(r, 1));
					//drawWorld();
				}
			}
		}
	}
	//return gotit

	/*console.log(found)
	
	// largest value of found
	let max = 0;
	let maxKeys = [];
	for (const [key, value] of found) {
		if (value === max) maxKeys.push(key)
		if (value > max) {
			max = value;
			maxKeys = [key];
		}
	}

	return maxKeys*/
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	solveTwo(`Sensor at x=2, y=18: closest beacon is at x=-2, y=15
	Sensor at x=9, y=16: closest beacon is at x=10, y=16
	Sensor at x=13, y=2: closest beacon is at x=15, y=3
	Sensor at x=12, y=14: closest beacon is at x=10, y=16
	Sensor at x=10, y=20: closest beacon is at x=10, y=16
	Sensor at x=14, y=17: closest beacon is at x=10, y=16
	Sensor at x=8, y=7: closest beacon is at x=2, y=10
	Sensor at x=2, y=0: closest beacon is at x=2, y=10
	Sensor at x=0, y=11: closest beacon is at x=2, y=10
	Sensor at x=20, y=14: closest beacon is at x=25, y=17
	Sensor at x=17, y=20: closest beacon is at x=21, y=22
	Sensor at x=16, y=7: closest beacon is at x=15, y=3
	Sensor at x=14, y=3: closest beacon is at x=15, y=3
	Sensor at x=20, y=1: closest beacon is at x=15, y=3`, 20).then(console.log).then(() => solveTwo(data, 4000000).then(console.log));
})();
