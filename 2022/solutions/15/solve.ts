const fs = require('fs');
const assert = require('assert');


const parseSensorInfo = (data: string) => {
	return data.split('\n').map(line => {
		const [sx, sy] = line.match(/x=(-?\d+), y=(-?\d+)/)!.slice(1).map(Number);
		const [bx, by] = line.split('beacon')[1].match(/x=(-?\d+), y=(-?\d+)/)!.slice(1).map(Number);
		return { sx, sy, bx, by, dist: Math.abs(sx - bx) + Math.abs(sy - by) };
	});
}


function solveOne(data: string, y: number): any {
	let count = 0;

	const seenXs = new Set();
	for (const { sx, sy, bx, by, dist } of parseSensorInfo(data)) {
		if (sy === y) seenXs.add(sx);
		if (by === y) seenXs.add(bx);

		for (let x = sx - dist; x <= sx + dist; x++) {
			if (!seenXs.has(x) && Math.abs(sx - x) + Math.abs(sy - y) <= dist) {
				seenXs.add(x);
				count++
			}
		}
	}

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
	console.log(solveOne(data, 2000000));
})();


function solveTwo(data: string, mxy: number): any {
	const sensorData = parseSensorInfo(data);

	const isOurOfAllSensorRanges = (x: number, y: number) => sensorData.every(({ sx, sy, dist }) =>
		Math.abs(sx - x) + Math.abs(sy - y) > dist
	);


	for (const { sx, sy, dist } of sensorData) {
		for (const xo of [-1, 1]) {
			for (const yo of [-1, 1]) {
				for (let dx = 0; dx <= dist + 1; dx++) {
					const dy = dist + 1 - dx;
					const x = sx + dx * xo;
					const y = sy + dy * yo;
					if (x >= 0 && y >= 0 && x <= mxy && y <= mxy && isOurOfAllSensorRanges(x, y)) {
						return x * 4000000 + y
					}
				}
			}
		}
	}
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`Sensor at x=2, y=18: closest beacon is at x=-2, y=15
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
	Sensor at x=20, y=1: closest beacon is at x=15, y=3`, 20), 56000011);
	console.log(solveTwo(data, 4000000));
})();
