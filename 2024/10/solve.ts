const fs = require('fs');
const assert = require('assert');


function dijkstra(graph: Record<string, string[]>, startNode: string) {
	const distances: Record<string, number> = { [startNode]: 0 };

	const previous: Record<string, string[]> = {};
	for (const node in graph) {
		previous[node] = [];
	}

	const visited = new Set<string>()

	while (visited.size < Object.keys(graph).length) {
		let currentNode = '';
		for (const node in graph) {
			if (!visited.has(node) && node in distances && distances[node] < (distances[currentNode] ?? Infinity)) {
				currentNode = node;
			}
		}
		if (currentNode === '') {
			break;
		}

		visited.add(currentNode)
		for (const neighbor of graph[currentNode]) {
			const totalDistance = distances[currentNode] + 1;

			previous[neighbor].push(currentNode);
			distances[neighbor] = totalDistance
		}
	}

	return { distances, previous };
}


function toKey<T>(...nums: T[]) {
	return nums.join('|')
}

function parseLavaIsland(data: string) {
	const world = data.replace(/\r/g, '').split('\n').map(l => [...l]);
	const graph: Record<string, string[]> = {};
	const starts: string[] = [];
	const ends: string[] = []
	for (let r = 0; r < world.length; r++) {
		for (let c = 0; c < world[r].length; c++) {
			const num = +world[r][c];
			const numKey = toKey(r, c)
			if (!(numKey in graph)) graph[numKey] = [];

			if (num === 0) starts.push(numKey)
			if (num === 9) ends.push(numKey)

			for (const [ro, co] of [[0, -1], [-1, 0], [0, 1], [1, 0]]) {
				const [nr, nc] = [r + ro, c + co];
				const neighbor = world[nr]?.[nc];
				if (neighbor === undefined) continue
				const neighborNum = +neighbor
				if (neighborNum === num + 1) {
					graph[numKey].push(toKey(nr, nc))
				}
			}
		}
	}

	return { graph, starts, ends }
}


function solve(data: string, measureTrailhead: (start: string, ends: string[], dijkstraResult: ReturnType<typeof dijkstra>) => number): any {
	const { graph, starts, ends } = parseLavaIsland(data);

	return starts.reduce((sum, start) => sum + measureTrailhead(start, ends, dijkstra(graph, start)), 0)
}

function solveOne(data: string): any {
	return solve(data, (_, ends, { distances }) => {
		let score = 0;
		for (const end of ends) {
			if (end in distances) {
				score++
			}
		}
		return score
	})
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
	return solve(data, (start, ends, { distances, previous }) => {
		function recur(current: string) {
			if (current === start) {
				return 1
			}

			let rating = 0
			for (const next of previous[current]) {
				rating += recur(next)
			}
			return rating
		}

		let score = 0;
		for (const end of ends) {
			if (end in distances) {
				score += recur(end)
			}
		}
		return score
	})
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
