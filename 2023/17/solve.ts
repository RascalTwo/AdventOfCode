const fs = require('fs');
const assert = require('assert');


class MinHeap<T> {
	private heap: { value: number; data: T }[];

	constructor(...initialValues: { value: number; data: T }[]) {
		this.heap = [];
		for (const value of initialValues) {
			this.insert(value.value, value.data);
		}
	}

	get size(): number {
		return this.heap.length;
	}

	private getParentIndex(index: number): number {
		return Math.floor((index - 1) / 2);
	}

	private getLeftChildIndex(index: number): number {
		return 2 * index + 1;
	}

	private getRightChildIndex(index: number): number {
		return 2 * index + 2;
	}

	private swap(index1: number, index2: number): void {
		[this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
	}

	private bubbleUp(): void {
		let currentIndex = this.size - 1;
		while (currentIndex > 0) {
			const parentIndex = this.getParentIndex(currentIndex);
			if (this.heap[currentIndex].value < this.heap[parentIndex].value) {
				this.swap(currentIndex, parentIndex);
				currentIndex = parentIndex;
			} else {
				break;
			}
		}
	}

	private bubbleDown(): void {
		let currentIndex = 0;
		while (true) {
			const leftChildIndex = this.getLeftChildIndex(currentIndex);
			const rightChildIndex = this.getRightChildIndex(currentIndex);
			let smallestChildIndex = currentIndex;

			if (
				leftChildIndex < this.size &&
				this.heap[leftChildIndex].value < this.heap[smallestChildIndex].value
			) {
				smallestChildIndex = leftChildIndex;
			}

			if (
				rightChildIndex < this.size &&
				this.heap[rightChildIndex].value < this.heap[smallestChildIndex].value
			) {
				smallestChildIndex = rightChildIndex;
			}

			if (currentIndex !== smallestChildIndex) {
				this.swap(currentIndex, smallestChildIndex);
				currentIndex = smallestChildIndex;
			} else {
				break;
			}
		}
	}

	insert(value: number, data: T): void {
		this.heap.push({ value, data });
		this.bubbleUp();
	}

	extractMin(): { value: number; data: T } | undefined {
		if (this.size === 0) {
			return undefined;
		}

		if (this.size === 1) {
			return this.heap.pop();
		}

		const minValue = this.heap[0];
		this.heap[0] = this.heap.pop()!;
		this.bubbleDown();

		return minValue;
	}

	peek(): { value: number; data: T } | undefined {
		return this.heap[0];
	}

	isEmpty(): boolean {
		return this.size === 0;
	}
}


const DIRECTIONS = [
	[1, 0],
	[0, 1],
	[-1, 0],
	[0, -1]
];

function minimalHeat(world: number[][], minMoves: number, maxMoves: number) {
	const start = [0, 0], end = [world.length - 1, world[0].length - 1];

	const seen = new Set();
	const heap = new MinHeap({ value: 0, data: { r: start[0], c: start[1], ro: 0, co: 0 } });
	while (heap.size > 0) {
		const { value: heat, data: { r, c, ro, co } } = heap.extractMin()!;

		if (r === end[0] && c === end[1]) return heat;

		const key = [r, c, ro, co].join(',')
		if (seen.has(key)) continue;
		seen.add(key);

		for (const [rv, cv] of DIRECTIONS) {
			if ((rv === ro && cv === co) || (rv === -ro && cv === -co)) continue;
			let nr = r, nc = c, newHeat = heat;

			for (let m = 1; m <= maxMoves; m++) {
				[nr, nc] = [nr + rv, nc + cv];
				if (nr < 0 || nr >= world.length || nc < 0 || nc >= world[0].length) break;

				newHeat += world[nr][nc];
				if (m >= minMoves)
					heap.insert(newHeat, { r: nr, c: nc, ro: rv, co: cv });
			}
		}
	}
}

function nextAttempt(world: number[][], minimum: number, maximum: number) {
	const end = [world.length - 1, world[0].length - 1];
	const queue = [{ heat: 0, r: 0, c: 0, direction: -1 }];
	const seen = new Set();
	while (queue.length) {
		const { heat, r, c, direction } = queue.pop()!;
		if (r === end[0] && c === end[1]) {
			return heat
		}
		const key = `${r}-${c}-${direction}`;
		if (seen.has(key)) {
			continue;
		}
		seen.add(key);

		for (const [di, [ro, co]] of VELOCITIES.entries()) {
			let cr = r;
			let cc = c;
			let cheat = heat;
			if (ro === VELOCITIES[direction]?.[0] && co === VELOCITIES[direction]?.[1])
				continue
			if (ro === -VELOCITIES[direction]?.[0] && co === -VELOCITIES[direction]?.[1])
				continue
			for (let i = 1; i <= maximum; i++) {
				cr += ro;
				cc += co;
				if (i < minimum || cr < 0 || cr >= world.length || cc < 0 || cc >= world[0].length)
					continue
				cheat += world[cr][cc];
				queue.push({ heat: cheat, r: cr, c: cc, direction: di });
			}
		}
		queue.sort((a, b) => b.heat - a.heat ?? b.r - a.r ?? b.c - a.c);
	}
}

function solveOne(data: string): any {
	const world = data.trim().split('\n').map((line) => line.split('').map((c) => parseInt(c)));

	return minimalHeat(world, 1, 3);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`
111111111
999999999`), 43);
	assert.deepStrictEqual(solveOne(`2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`), 102);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const world = data.trim().split('\n').map((line) => line.split('').map((c) => parseInt(c)));

	return minimalHeat(world, 4, 10);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`), 94);
	assert.deepStrictEqual(solveTwo(`111111111111
999999999991
999999999991
999999999991
999999999991
`), 71);
	console.log(solveTwo(data));
})();
