const fs = require('fs');
const assert = require('assert');


function dijkstra(graph: Record<string, Record<string, number>>, startNode: string) {
	const distances = {};
	const visited = {};
	const previous = {};

	// Initialize distances with Infinity for all nodes except the startNode
	for (const node in graph) {
		distances[node] = Infinity;
		previous[node] = [];
	}
	distances[startNode] = 0;

	while (Object.keys(visited).length < Object.keys(graph).length) {
		let currentNode = null;
		let shortestDistance = Infinity;

		// Find the unvisited node with the smallest distance
		for (const node in graph) {
			if (!visited[node] && distances[node] < shortestDistance) {
				currentNode = node;
				shortestDistance = distances[node];
			}
		}

		if (currentNode === null) {
			break; // No reachable nodes left
		}

		visited[currentNode] = true;

		// Update distances to neighbors of the current node
		for (const neighbor in graph[currentNode]) {
			const distance = graph[currentNode][neighbor];
			const totalDistance = distances[currentNode] + distance;

			previous[neighbor].push(currentNode);
			if (totalDistance < distances[neighbor]) {
				distances[neighbor] = totalDistance;
			}
		}
	}

	return { distances, previous };
}


function toKey<T>(...nums: T[]) {
	return nums.join('|')
}

function fromKey(key: string) {
	return key.split('|').map(Number)
}

function solveOne(data: string): any {
	const world = data.replace(/\r/g, '').split('\n').map(l => [...l]);
	const graph: Record<string, Record<string, number>> = {};
	const starts = [];
	const ends = []
	for (let r = 0; r < world.length; r++) {
		for (let c = 0; c < world[r].length; c++) {
			const num = +world[r][c];
			const numKey = toKey(r, c)
			if (!(numKey in graph)) graph[numKey] = {};

			if (num === 0) starts.push({ r, c })
			if (num === 9) ends.push({ r, c })

			for (const [ro, co] of [[0, -1], [-1, 0], [0, 1], [1, 0]]) {
				const [nr, nc] = [r + ro, c + co];
				const neighbor = world[nr]?.[nc];
				if (neighbor === undefined) continue
				const neighborNum = +neighbor
				if (neighborNum === num + 1) {
					graph[numKey][toKey(nr, nc)] = 1
				}
			}
		}
	}


	let allScores = 0
	for (const start of starts) {
		const { distances } = dijkstra(graph, toKey(start.r, start.c))
		let score = 0;
		for (const end of ends) {
			const distance = distances[toKey(end.r, end.c)]
			if (distance !== undefined && distance !== Infinity) {
				score++
			}
		}
		const copyWorld = world.map(r => [...r]);
		for (let r = 0; r < copyWorld.length; r++) {
			for (let c = 0; c < copyWorld[r].length; c++) {
				const key = toKey(r, c)
				const distance = distances[key]
				if (distance !== undefined && distance !== Infinity) {
				} else {
					copyWorld[r][c] = '.'
				}
			}
		}
		allScores += score
	}
	return allScores
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`
...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9
`.trim()), 2);
	assert.deepStrictEqual(solveOne(`
..90..9
...1.98
...2..7
6543456
765.987
876....
987....
`.trim()), 4);
	assert.deepStrictEqual(solveOne(`
10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01
	`.trim()), 3);
	assert.deepStrictEqual(solveOne(`
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`.trim()), 36);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const world = data.replace(/\r/g, '').split('\n').map(l => [...l]);
	const graph: Record<string, Record<string, number>> = {};
	const starts = [];
	const ends = []
	for (let r = 0; r < world.length; r++) {
		for (let c = 0; c < world[r].length; c++) {
			const num = +world[r][c];
			const numKey = toKey(r, c)
			if (!(numKey in graph)) graph[numKey] = {};

			if (num === 0) starts.push({ r, c })
			if (num === 9) ends.push({ r, c })

			for (const [ro, co] of [[0, -1], [-1, 0], [0, 1], [1, 0]]) {
				const [nr, nc] = [r + ro, c + co];
				const neighbor = world[nr]?.[nc];
				if (neighbor === undefined) continue
				const neighborNum = +neighbor
				if (neighborNum === num + 1) {
					graph[numKey][toKey(nr, nc)] = 1
				}
			}
		}
	}


	let allScores = 0
	for (const start of starts) {
		const { distances, previous } = dijkstra(graph, toKey(start.r, start.c))
		function calculateRating(start: { r: number, c: number }, end: { r: number, c: number }) {
			let rating = 0;

			const endKey = toKey(end.r, end.c)
			const paths = [[toKey(start.r, start.c)]]
			while (paths.length) {
				const path = paths.pop()!;
				const current = path.at(-1)!
				for (const next of previous[current] ?? []) {
					if (next === endKey) {
						rating++
					} else {
						paths.push([...path, next])
					}
				}
			}

			return rating
		}
		let score = 0;
		for (const end of ends) {
			const distance = distances[toKey(end.r, end.c)]
			if (distance !== undefined && distance !== Infinity) {
				const rating = calculateRating(end, start)
				score += rating
			}
		}
		allScores += score
	}
	return allScores
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`
.....0.
..4321.
..5..2.
..6543.
..7..4.
..8765.
..9....`.trim()), 3);
	console.log(solveTwo(data));
})();
