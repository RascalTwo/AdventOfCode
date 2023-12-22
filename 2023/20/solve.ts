const fs = require('fs');
const assert = require('assert');


const calcGCD = (a: number, b: number) => {
	while (b) [a, b] = [b, a % b];
	return a
}

const calcLCM = (a: number, b: number) => {
	return a * b / calcGCD(a, b)
}

function generateWorld(data: string): { graph: Record<string, string[]>, flips: Record<string, boolean>, conjs: Record<string, Record<string, boolean>> } {
	const edges = data.trim().split('\n').map((line: string) => {
		const [from, rawTos] = line.trim().split(' -> ');
		const type = from[0] === '%' ? 'FLP' : from[0] === '&' ? 'CONJ' : null
		return { from: from.slice(type ? 1 : 0), type, tos: rawTos.split(', ') };
	});
	const graph = edges.reduce((graph, mod) => ({ ...graph, [mod.from]: mod.tos }), {} as Record<string, string[]>);

	const flips = edges.filter((path) => path.type === 'FLP').reduce((flips, mod) => ({ ...flips, [mod.from]: false }), {} as Record<string, boolean>);

	const conjs = edges.filter((path) => path.type === 'CONJ').reduce((conjs, mod) => ({ ...conjs, [mod.from]: {} }), {} as Record<string, Record<string, boolean>>);
	for (const { from, tos } of edges)
		for (const to of tos)
			if (to in conjs)
				conjs[to][from] = false;

	return { graph, flips, conjs }
}

function solve(data: string): any {
	const world = generateWorld(data);

	function calculateNextSignal(from: string, to: string, signal: boolean): boolean | null {
		if (to in world.conjs) {
			world.conjs[to][from] = signal;
			return !Object.values(world.conjs[to]).every((pulse) => pulse);
		}

		if (to in world.flips) {
			if (signal)
				return null
			return world.flips[to] = !world.flips[to];
		}

		return signal;
	}

	function* generateNextPulses(from: string, to: string, signal: boolean): Generator<[string, string, boolean]> {
		const nextSignal = calculateNextSignal(from, to, signal);

		if (nextSignal !== null)
			for (const nextReceiver of world.graph[to])
				yield [to, nextReceiver, nextSignal];
	}

	function cycle(): [number, number] {
		const queue: [string, string, boolean][] = [['btn', 'broadcaster', false]];
		let high = 0;
		let low = 0;
		while (queue.length) {
			const [from, to, signal] = queue.pop()!;
			high += +signal;
			low += +!signal;
			if (to in world.graph) queue.push(...generateNextPulses(from, to, signal));
		}
		return [high, low]
	}

	let highs = 0, lows = 0;
	for (let i = 0; i < 1000; i++) {
		const [high, low] = cycle();
		highs += high;
		lows += low;
	}


	const rxSource = Object.keys(world.graph).find(key => world.graph[key].length === 1 && world.graph[key][0] === 'rx');
	if (!rxSource)
		return [highs * lows, 0]

	for (const key in world.flips)
		world.flips[key] = false;
	for (const key in world.conjs)
		for (const key2 in world.conjs[key])
			world.conjs[key][key2] = false;


	let lcm = 1;
	const toRxs = new Set<string>(Object.keys(world.graph).filter(key => world.graph[key].includes(rxSource)));

	for (let i = 1; ; i++) {
		const queue: [string, string, boolean][] = [['button', 'broadcaster', false]];
		while (queue.length) {
			const [from, to, signal] = queue.shift()!;
			if (!signal && toRxs.has(to)) {
				lcm = calcLCM(lcm, i)
				toRxs.delete(to)
				if (!toRxs.size) return [highs * lows, lcm]
			}

			if (to in world.graph) queue.push(...generateNextPulses(from, to, signal));
		}
	}
}


function solveOne(data: string): any {
	return solve(data)[0]
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`), 32000000);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	return solve(data)[1]
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	console.log(solveTwo(data));
})();
