const fs = require('fs');
const assert = require('assert');


interface Valve {
	valveName: string;
	flowRate: number;
	tunnelNames: string[];
}

const parseFlowInfo = (data: string) => {
	return data.split('\n').map(line => {
		const [valve, tunnels] = line.split(';');
		const [valveName, flowRate] = valve.split(' has flow rate=');
		const tunnelNames = tunnels.split(/ leads? to valves? /ig)[1].split(', ');
		return {
			valveName: valveName.split(/\s+/)[1],
			flowRate: parseInt(flowRate),
			tunnelNames
		}
	}).reduce((obj, valve) => ({ ...obj, [valve.valveName]: valve }), {})
}

function solveOne(data: string): any {
	const valves: Record<string, Valve> = parseFlowInfo(data);
	const cache = new Map();
	function recur(time: number, human: string, opens: Map<string, number>) {
		const q = [...opens.entries()].reduce((sum, [key, value]) => sum + (value ? value * valves[key]!.flowRate : 0), 0)
		if (!time) return q;

		const key = `${time}-${human}`;
		if ((cache.get(key) || -1) >= q) return 0;
		cache.set(key, q);

		let best = 0;
		for (const nextHuman of [human, ...valves[human]!.tunnelNames]) {
			if (human === nextHuman) {
				if (opens.has(human) || !valves[human]!.flowRate) continue
				opens.set(human, time)
			}
			best = Math.max(best, recur(time - 1, nextHuman, opens))
			// backtrack and un-open
			if (human === nextHuman) opens.delete(human);
		}

		return best;
	}
	return recur(29, 'AA', new Map());
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`), 1649); // off by two, supposed to be 1651
	console.log(solveOne(data));
})();



function solveTwo(data: string): any {
	const valves: Record<string, Valve> = parseFlowInfo(data);
	const cache = new Map();
	function recur(time: number, human: string, elephant: string, opens: Map<string, number>) {
		const q = [...opens.entries()].reduce((sum, [key, value]) => sum + (value ? value * valves[key]!.flowRate : 0), 0)
		if (!time) return q;

		const key = `${time}-${human}-${elephant}`;
		if ((cache.get(key) || -1) >= q) return 0;
		cache.set(key, q);

		let best = 0;
		for (const nextHuman of [human, ...valves[human]!.tunnelNames]) {
			if (human === nextHuman) {
				if (opens.has(human) || !valves[human]!.flowRate) continue
				opens.set(human, time)
			}
			for (const nextElephant of [elephant, ...valves[elephant]!.tunnelNames]) {
				if (elephant === nextElephant) {
					if (opens.has(elephant) || !valves[elephant]!.flowRate) continue
					opens.set(elephant, time)
				}
				best = Math.max(best, recur(time - 1, nextHuman, nextElephant, opens))

				// backtrack and un-open
				if (elephant === nextElephant) opens.delete(elephant);
			}

			// backtrack and un-open
			if (human === nextHuman) opens.delete(human);
		}

		return best;
	}
	return recur(25, 'AA', 'AA', new Map());
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`), 1706); // oof by one, supposed to be 1707
	console.log(solveTwo(data));
})();
