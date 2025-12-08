const fs = require('fs');
const assert = require('assert');

function euclideanDistance3D(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const dz = point2.z - point1.z;

  return Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));
}
function solveOne(data: string, connectionCount: number): any {
	const boxes = data.split('\n').map(l => {
		const [x, y, z] = l.split(',').map(Number)
		return { x, y, z }
	})
	const possibleConnections = [];
	for (const [ai, a] of boxes.entries()) {
		for (const b of boxes.slice(ai + 1)) {
			possibleConnections.push({ a, b, distance: euclideanDistance3D(a, b) })
		}
	}
	possibleConnections.sort((one, two) => {
		return one.distance - two.distance
	})
	const connections: Record<string, string[]> = {};
	for (let i = 0; i < connectionCount; i++) {
		const { a, b }  = possibleConnections[i];
		connections[JSON.stringify(a)] = [...(connections[JSON.stringify(a)] ?? []), JSON.stringify(b)]
	}
	const groups: Set<string>[] = [];
	for (const key in connections){
		let group = groups.find(g => g.has(key))
		if (!group) {
			group = new Set([key]);
			groups.push(group)
		}
		for (const conn of connections[key]){
			group.add(conn)
		}
	}
	while (true){
		let merged = false
		for (const a of groups){
			for (const b of groups){
				if (a === b) continue;
				if ([...a].some(ai => b.has(ai))){
					for (const bi of b){
						a.add(bi)
					}
					groups.splice(groups.indexOf(b), 1)
					merged = true
					break
				}
			}
		}
		if (!merged) break
	}
	groups.sort((a, b) => b.size - a.size)
	return groups.slice(0, 3).map(g => g.size).reduce((a, b) => a * b, 1)
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
	const boxes = data.split('\n').map(l => {
		const [x, y, z] = l.split(',').map(Number)
		return { x, y, z }
	})
	const possibleConnections = [];
	for (const [ai, a] of boxes.entries()) {
		for (const b of boxes.slice(ai + 1)) {
			possibleConnections.push({ a, b, distance: euclideanDistance3D(a, b) })
		}
	}
	possibleConnections.sort((one, two) => {
		return one.distance - two.distance
	})
	const connections: Record<string, string[]> = {};
	let i = 0
	while (true) {
		const { a, b }  = possibleConnections[i];
		i++;
		connections[JSON.stringify(a)] = [...(connections[JSON.stringify(a)] ?? []), JSON.stringify(b)]
		const groups: Set<string>[] = [];
		for (const key in connections){
			let group = groups.find(g => g.has(key))
			if (!group) {
				group = new Set([key]);
				groups.push(group)
			}
			for (const conn of connections[key]){
				group.add(conn)
			}
		}
		while (true){
			let merged = false
			for (const a of groups){
				for (const b of groups){
					if (a === b) continue;
					if ([...a].some(ai => b.has(ai))){
						for (const bi of b){
							a.add(bi)
						}
						groups.splice(groups.indexOf(b), 1)
						merged = true
						break
					}
				}
			}
			if (!merged) break
		}
		groups.sort((a, b) => b.size - a.size)
		if (groups.length === 1 && groups[0].size === boxes.length) {
			a
			b
			return a.x * b.x;
		}
	}
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