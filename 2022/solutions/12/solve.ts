const fs = require('fs');
const assert = require('assert');


function bfs(matrix: number[][], end: [number, number], ...starts: [number, number][]): number {
	const queue = starts.map(start => ({ coord: start, cost: 0 }))
	const seen = new Map<number, Set<number>>()
	while (queue[0].coord[0] !== end[0] || queue[0].coord[1] !== end[1]) {
		const { coord: [x, y], cost } = queue.shift()!;

		if (seen.get(x)?.has(y)) continue;
		if (!seen.has(x)) seen.set(x, new Set());
		seen.get(x)!.add(y);

		for (const neighbor of [
			[x - 1, y],
			[x + 1, y],
			[x, y - 1],
			[x, y + 1],
		]) {
			const [i, j] = neighbor;
			if (!(i < 0 || i >= matrix.length || j < 0 || j >= matrix[0].length || matrix[i][j] > matrix[x][y] + 1)) {
				queue.push({ coord: [i, j], cost: cost + 1 })
			}
		}
	}

	return queue[0].cost
}

function parseElevations(data: string) {
	const matrix = data.split('\n').map(line => line.split('').map(char => char.charCodeAt(0) - 96));
	let start: [number, number] | null = null;
	let end: [number, number] | null = null;
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			if (matrix[i][j] === -13) start = [i, j];
			if (matrix[i][j] === -27) end = [i, j];

			if (end && start) break;
		}
		if (end && start) break;
	}

	matrix[start![0]][start![1]] = 1;
	matrix[end![0]][end![1]] = 26;

	return { matrix, start: start!, end: end! };
}

function solveOne(data: string): any {
	const { matrix, start, end } = parseElevations(data)
	return bfs(matrix, end, start);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`), 31);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const { matrix, end } = parseElevations(data);

	const starts: [number, number][] = []
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			if (matrix[i][j] === 1) {
				starts.push([i, j]);
			}
		}
	}

	return bfs(matrix, end!, ...starts);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`), 29);
	console.log(solveTwo(data));
})();
