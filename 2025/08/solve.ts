const fs = require('fs');
const assert = require('assert');

type Point = Record<'x' | 'y' | 'z', number>

function euclideanDistance3D(point1: Point, point2: Point) {
	const dx = point2.x - point1.x;
	const dy = point2.y - point1.y;
	const dz = point2.z - point1.z;

	return Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));
}

const serialize = ({ x, y, z }: Point) => `${x},${y},${z}`

const setsShareAValue = <T>(a: Set<T>, b: Set<T>) => {
	for (const aValue of a) {
		if (b.has(aValue)) {
			return true;
		}
	}
	return false;
}

function solve(data: string, connectionsToMake: number, generateAnswer: (state: { a: Point, b: Point, groups: Set<string>[] }) => number): any {
	const points = data.split('\n').map(l => {
		const [x, y, z] = l.split(',').map(Number)
		return { x, y, z } as Point
	})

	const possibleConnections: { a: Point, b: Point, distance: number }[] = [];
	for (const [ai, a] of points.entries()) {
		for (const b of points.slice(ai + 1)) {
			possibleConnections.push({ a, b, distance: euclideanDistance3D(a, b) })
		}
	}
	possibleConnections.sort((one, two) => one.distance - two.distance);

	const groups: Set<string>[] = [];
	for (let i = 0; i < connectionsToMake; i++) {
		const { a, b } = possibleConnections[i];
		const serializedA = serialize(a);

		let group = groups.find(g => g.has(serializedA))
		if (!group) {
			group = new Set([serializedA]);
			groups.push(group)
		}
		group.add(serialize(b))

		outerLoop:
		for (let ai = 0; ai < groups.length; ai++) {
			const a = groups[ai]
			for (let bi = ai + 1; bi < groups.length; bi++) {
				const b = groups[bi];

				if (setsShareAValue(a, b)) {
					for (const point of b) a.add(point)
					groups.splice(bi, 1)
					break outerLoop;
				}
			}
		}

		if (groups.length === 1 && groups[0].size === points.length) {
			return generateAnswer({ a, b, groups })
		}
		if (i === connectionsToMake - 1) {
			return generateAnswer({ a, b, groups })
		}
	}
}


function solveOne(data: string, connectionCount: number): any {
	return solve(data, connectionCount, ({ groups }) => groups.sort((a, b) => b.size - a.size).slice(0, 3).map(g => g.size).reduce((a, b) => a * b, 1))
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`, 10), 40);
	console.log(solveOne(data, 1000));
})();


function solveTwo(data: string): any {
	return solve(data, Infinity, ({ a, b }) => a.x * b.x)
}



(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`), 25272);
	console.log(solveTwo(data));
})();

export { };