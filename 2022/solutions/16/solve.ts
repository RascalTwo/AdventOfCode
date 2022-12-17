const fs = require('fs');
const assert = require('assert');


const parseFlowInfo = (data: string) => {
	return data.split('\n').reduce((map, line) => {
		const [valve, tunnels] = line.split(';');
		const [rawValveName, flowRate] = valve.split(' has flow rate=');
		const valveName = rawValveName.split(/\s+/)[1]

		map.set(valveName, {
			flowRate: parseInt(flowRate),
			tunnelNames: tunnels.split(/ leads? to valves? /ig)[1].split(', ')
		});
		return map;
	}, new Map())
}

function solve(data: string, partTwo: boolean) {
	const valves: Map<string, { flowRate: number, tunnelNames: string[] }> = parseFlowInfo(data);

	const cache = new Map();
	const opened = new Map();
	function recur(time: number, human: string, elephant: string | null) {
		const flowed = [...opened.entries()].reduce((sum, [key, value]) => sum + (value ? value * valves.get(key)!.flowRate : 0), 0)
		if (!time) return flowed;

		const key = `${time}-${human}-${elephant}`;
		if ((cache.get(key) || -Infinity) >= flowed) return 0;
		cache.set(key, flowed);

		let best = 0;
		for (const nextHuman of [human, ...valves.get(human)!.tunnelNames]) {
			if (human === nextHuman) {
				if (opened.has(human) || !valves.get(human)!.flowRate) continue
				opened.set(human, time)
			}

			if (elephant) for (const nextElephant of [elephant, ...valves.get(elephant)!.tunnelNames]) {
				if (elephant === nextElephant) {
					if (opened.has(elephant) || !valves.get(elephant)!.flowRate) continue
					opened.set(elephant, time)
				}

				best = Math.max(best, recur(time - 1, nextHuman, nextElephant))

				if (elephant === nextElephant) opened.delete(elephant);
			} else {
				best = Math.max(best, recur(time - 1, nextHuman, elephant))
			}

			if (human === nextHuman) opened.delete(human);
		}

		return best;
	}
	return partTwo ? recur(25, 'AA', 'AA') : recur(29, 'AA', null);
}

function solveOne(data: string): any {
	return solve(data, false);
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
	return solve(data, true);
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
