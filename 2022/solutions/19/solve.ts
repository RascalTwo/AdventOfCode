const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	const blueprints = data.toLowerCase().split('\n').map((line) => {
		return line.split('each ').slice(1).map(req => req.split('.')[0]).map(req => {
			const [robot, requirements] = req.split(' robot costs ')
			return {
				robot,
				requirements: requirements.split(' and ').map(req => {
					const [count, resource] = req.split(' ')
					return {
						count: parseInt(count),
						resource
					}
				}).reduce((obj, { count, resource }) => ({ ...obj, [resource]: count }), {} as Record<'ore' | 'clay' | 'obsidian' | 'geode', number>)
			}
		})
	})
	let sum = 0;

	function bfs(oreOreCost: number, clayOreCost: number, obsidianOreCost: number, obsidianClayCost: number, geodeOreCode: number, geodeObsidianCost: number, minutesLeft: number) {
		let best = -Infinity;
		const queue = [[0, 0, 0, 0, 1, 0, 0, 0, minutesLeft]]
		const seen = new Set();
		while (queue.length) {
			const next = queue.pop()!;
			let [ore, clay, obsidian, geode, oreRobots, clayRobots, obsidianRobots, geodeRobots, minutesLeft] = next;

			best = Math.max(best, geode)
			if (minutesLeft === 0) {
				continue;
			}

			const maxOreCost = Math.max(oreOreCost, clayOreCost, obsidianOreCost, geodeOreCode);
			if (oreRobots >= maxOreCost) oreRobots = maxOreCost;
			if (clayRobots >= obsidianClayCost) clayRobots = obsidianClayCost;
			if (geodeRobots >= geodeObsidianCost) geodeRobots = geodeObsidianCost;
			if (ore >= minutesLeft * maxOreCost - oreRobots * (minutesLeft - 1)) {
				ore = minutesLeft * maxOreCost - oreRobots * (minutesLeft - 1);
			}
			if (clay >= minutesLeft * obsidianClayCost - clayRobots * (minutesLeft - 1)) {
				clay = minutesLeft * obsidianClayCost - clayRobots * (minutesLeft - 1);
			}
			if (obsidian >= minutesLeft * geodeObsidianCost - obsidianRobots * (minutesLeft - 1)) {
				obsidian = minutesLeft * geodeObsidianCost - obsidianRobots * (minutesLeft - 1);
			}

			const state = [ore, clay, obsidian, geode, oreRobots, clayRobots, obsidianRobots, geodeRobots, minutesLeft];
			const key = JSON.stringify(state);
			if (seen.has(key)) {
				continue;
			}
			seen.add(key);

			queue.push([ore + oreRobots, clay + clayRobots, obsidian + obsidianRobots, geode + geodeRobots, oreRobots, clayRobots, obsidianRobots, geodeRobots, minutesLeft - 1])
			if (ore >= oreOreCost) {
				queue.push([ore - oreOreCost + oreRobots, clay + clayRobots, obsidian + obsidianRobots, geode + geodeRobots, oreRobots + 1, clayRobots, obsidianRobots, geodeRobots, minutesLeft - 1])
			}
			if (ore >= clayOreCost) {
				queue.push([ore - clayOreCost + oreRobots, clay + clayRobots, obsidian + obsidianRobots, geode + geodeRobots, oreRobots, clayRobots + 1, obsidianRobots, geodeRobots, minutesLeft - 1])
			}
			if (ore >= obsidianOreCost && clay >= obsidianClayCost) {
				queue.push([ore - obsidianOreCost + oreRobots, clay - obsidianClayCost + clayRobots, obsidian + obsidianRobots, geode + geodeRobots, oreRobots, clayRobots, obsidianRobots + 1, geodeRobots, minutesLeft - 1])
			}
			if (ore >= geodeOreCode && obsidian >= geodeObsidianCost) {
				queue.push([ore - geodeOreCode + oreRobots, clay + clayRobots, obsidian - geodeObsidianCost + obsidianRobots, geode + geodeRobots, oreRobots, clayRobots, obsidianRobots, geodeRobots + 1, minutesLeft - 1])
			}
		}
		return best;
	}
	for (const [b, blueprint] of blueprints.entries()) {
		const oreBot = blueprint.find(req => req.robot === 'ore')!
		const clayBot = blueprint.find(req => req.robot === 'clay')!
		const obsidianBot = blueprint.find(req => req.robot === 'obsidian')!
		const geodeBot = blueprint.find(req => req.robot === 'geode')!
		const bestForB = bfs(oreBot.requirements.ore, clayBot.requirements.ore, obsidianBot.requirements.ore, obsidianBot.requirements.clay, geodeBot.requirements.ore, geodeBot.requirements.obsidian, 24);
		console.log(b, bestForB);
		sum += bestForB * (b + 1)
	}
	return sum;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`), 33);
	console.log(solveOne(data));
});


function solveTwo(data: string): any {
	const blueprints = data.toLowerCase().split('\n').map((line) => {
		return line.split('each ').slice(1).map(req => req.split('.')[0]).map(req => {
			const [robot, requirements] = req.split(' robot costs ')
			return {
				robot,
				requirements: requirements.split(' and ').map(req => {
					const [count, resource] = req.split(' ')
					return {
						count: parseInt(count),
						resource
					}
				}).reduce((obj, { count, resource }) => ({ ...obj, [resource]: count }), {} as Record<'ore' | 'clay' | 'obsidian' | 'geode', number>)
			}
		})
	})
	let sum = 0;

	function bfs(oreOreCost: number, clayOreCost: number, obsidianOreCost: number, obsidianClayCost: number, geodeOreCode: number, geodeObsidianCost: number, minutesLeft: number) {
		let best = -Infinity;
		const queue = [[0, 0, 0, 0, 1, 0, 0, 0, minutesLeft]]
		const seen = new Set();
		while (queue.length) {
			const next = queue.pop()!;
			let [ore, clay, obsidian, geode, oreRobots, clayRobots, obsidianRobots, geodeRobots, minutesLeft] = next;

			best = Math.max(best, geode)
			if (minutesLeft === 0) {
				continue;
			}

			const maxOreCost = Math.max(oreOreCost, clayOreCost, obsidianOreCost, geodeOreCode);
			if (oreRobots >= maxOreCost) oreRobots = maxOreCost;
			if (clayRobots >= obsidianClayCost) clayRobots = obsidianClayCost;
			if (geodeRobots >= geodeObsidianCost) geodeRobots = geodeObsidianCost;
			if (ore >= minutesLeft * maxOreCost - oreRobots * (minutesLeft - 1)) {
				ore = minutesLeft * maxOreCost - oreRobots * (minutesLeft - 1);
			}
			if (clay >= minutesLeft * obsidianClayCost - clayRobots * (minutesLeft - 1)) {
				clay = minutesLeft * obsidianClayCost - clayRobots * (minutesLeft - 1);
			}
			if (obsidian >= minutesLeft * geodeObsidianCost - obsidianRobots * (minutesLeft - 1)) {
				obsidian = minutesLeft * geodeObsidianCost - obsidianRobots * (minutesLeft - 1);
			}

			const state = [ore, clay, obsidian, geode, oreRobots, clayRobots, obsidianRobots, geodeRobots, minutesLeft];
			const key = JSON.stringify(state);
			if (seen.has(key)) {
				continue;
			}
			seen.add(key);

			queue.push([ore + oreRobots, clay + clayRobots, obsidian + obsidianRobots, geode + geodeRobots, oreRobots, clayRobots, obsidianRobots, geodeRobots, minutesLeft - 1])
			if (ore >= geodeOreCode && obsidian >= geodeObsidianCost) {
				queue.push([ore - geodeOreCode + oreRobots, clay + clayRobots, obsidian - geodeObsidianCost + obsidianRobots, geode + geodeRobots, oreRobots, clayRobots, obsidianRobots, geodeRobots + 1, minutesLeft - 1])
				continue
			}

			if (ore >= obsidianOreCost && clay >= obsidianClayCost) {
				queue.push([ore - obsidianOreCost + oreRobots, clay - obsidianClayCost + clayRobots, obsidian + obsidianRobots, geode + geodeRobots, oreRobots, clayRobots, obsidianRobots + 1, geodeRobots, minutesLeft - 1])
				continue
			}

			if (ore >= oreOreCost) {
				queue.push([ore - oreOreCost + oreRobots, clay + clayRobots, obsidian + obsidianRobots, geode + geodeRobots, oreRobots + 1, clayRobots, obsidianRobots, geodeRobots, minutesLeft - 1])
			}
			if (ore >= clayOreCost) {
				queue.push([ore - clayOreCost + oreRobots, clay + clayRobots, obsidian + obsidianRobots, geode + geodeRobots, oreRobots, clayRobots + 1, obsidianRobots, geodeRobots, minutesLeft - 1])
			}
		}
		return best;
	}
	for (const [b, blueprint] of [...blueprints.entries()].slice(0, 3)) {
		const oreBot = blueprint.find(req => req.robot === 'ore')!
		const clayBot = blueprint.find(req => req.robot === 'clay')!
		const obsidianBot = blueprint.find(req => req.robot === 'obsidian')!
		const geodeBot = blueprint.find(req => req.robot === 'geode')!
		const bestForB = bfs(oreBot.requirements.ore, clayBot.requirements.ore, obsidianBot.requirements.ore, obsidianBot.requirements.clay, geodeBot.requirements.ore, geodeBot.requirements.obsidian, 32);
		console.log(b, bestForB);
		sum += bestForB;
	}
	return sum;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	solveTwo(`Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
	Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`)
	// one = 56
	// two = 62
	console.log(solveTwo(data));
})();
