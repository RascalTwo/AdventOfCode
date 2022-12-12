const fs = require('fs');
const assert = require('assert');


function solveOne(data: string): any {
	const matrix = data.split('\n').map(line => line.split('').map(char => char.charCodeAt(0) - 96));
	let start = null;
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			if (matrix[i][j] === -13) {
				start = [i, j];
				break;
			}
		}
	}
	matrix[start![0]][start![1]] = 1;
	let end = null;
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			if (matrix[i][j] === -27) {
				end = [i, j];
				break;
			}
		}
	}
	matrix[end![0]][end![1]] = 26;

	const visited = new Set();
	const costs = new Map();
	const parents = new Map();
	const queue = new Map();
	queue.set(start?.join(','), 0);
	while (queue.size > 0) {
		let min = Infinity;
		let minKey = null;
		for (const [key, value] of queue) {
			if (value < min) {
				min = value;
				minKey = key;
			}
		}
		const [x, y] = minKey.split(',').map(Number);
		queue.delete(minKey);
		visited.add(minKey);
		if (minKey === end?.join(',')) {
			break;
		}
		const neighbors = [
			[x - 1, y],
			[x + 1, y],
			[x, y - 1],
			[x, y + 1],
		].filter(([i, j]) => {
			// if weight is greater then one higher then current weight, then it is not a neighbor
			if (matrix[i]?.[j] > matrix[x][y] + 1) {
				return false;
			}
			return true;
		});
		for (const neighbor of neighbors) {
			const [i, j] = neighbor;
			if (i < 0 || i >= matrix.length || j < 0 || j >= matrix[i].length) {
				continue;
			}
			if (visited.has(neighbor.join(','))) {
				continue;
			}
			const cost = costs.get(minKey) || 0;
			const newCost = cost + matrix[i][j];
			const oldCost = costs.get(neighbor.join(','));
			if (oldCost === undefined || newCost < oldCost) {
				costs.set(neighbor.join(','), newCost);
				parents.set(neighbor.join(','), minKey);
				queue.set(neighbor.join(','), newCost);
			}
		}
	}
	let current = end?.join(',');
	let path = [];
	while (current !== start?.join(',')) {
		path.push(current);
		current = parents.get(current);
	}

	return path.length;
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
	const matrix = data.split('\n').map(line => line.split('').map(char => char.charCodeAt(0) - 96));
	let start = null;
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			if (matrix[i][j] === -13) {
				start = [i, j];
				break;
			}
		}
	}
	matrix[start![0]][start![1]] = 1;
	const starts = []
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			if (matrix[i][j] === 1) {
				starts.push([i, j]);
			}
		}
	}
	let end = null;
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			if (matrix[i][j] === -27) {
				end = [i, j];
				break;
			}
		}
	}
	matrix[end![0]][end![1]] = 26;
	// function to convert coordinate to single number based on matrix size
	const coordToNum = (coord: [number, number]) => {
		const [i, j] = coord;
		return i * matrix[0].length + j;
	}
	// function to convert single number to coordinate based on matrix size
	const numToCoord = (num: number) => {
		const i = Math.floor(num / matrix[0].length);
		const j = num % matrix[0].length;
		return [i, j];
	}
	// @ts-ignore
	//end = coordToNum(end!);
	if (!end) return


	const queue = starts.map(start => ({ coord: start, cost: 0 }))
	const seen: Record<number, Record<number, true>> = {}
	let best = Infinity;
	while(queue[0].coord[0] !== end[0] || queue[0].coord[1] !== end[1]) {
		const { coord: [x, y], cost } = queue.shift()!;
		if (seen?.[x]?.[y]) {
			continue;
		}
		seen[x] = seen[x] || {};
		seen[x][y] = true;
		const neighbors = [
			[x - 1, y],
			[x + 1, y],
			[x, y - 1],
			[x, y + 1],
		].filter(([i, j]) => {
			// if weight is greater then one higher then current weight, then it is not a neighbor
			if (matrix[i]?.[j] > matrix[x][y] + 1) {
				return false;
			}
			return true;
		});
		for (const neighbor of neighbors) {
			const [i, j] = neighbor;
			if (i < 0 || i >= matrix.length || j < 0 || j >= matrix[0].length) {
				continue;
			}
			queue.push({ coord: [i, j], cost: cost + 1 });
		}
	}

	return queue[0].cost
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
