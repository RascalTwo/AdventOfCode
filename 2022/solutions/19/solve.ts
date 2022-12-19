const fs = require('fs');
const assert = require('assert');


type Resource = 'ore' | 'clay' | 'obsidian' | 'geode'
type BotRequirements = Record<Resource, number>

const parseBlueprints = (data: string) =>
	data.toLowerCase().split('\n').map(line => line.split('each ').slice(1).reduce((bots, text) => {
		const [robot, requirements] = text.split('.')[0].split(' robot costs ')
		bots[robot as Resource] = requirements.split(' and ').reduce((requirements, text) => {
			const [count, resource] = text.split(' ')
			requirements[resource as Resource] = parseInt(count)
			return requirements
		}, {} as BotRequirements)
		return bots
	}, {} as Record<Resource, BotRequirements>))



function bfs(oreBotReq: BotRequirements, clayBotReq: BotRequirements, obsidianBotReq: BotRequirements, geodeBotReq: BotRequirements, minutesLeft: number) {
	let best = -Infinity;
	const seen = new Set();

	const stack = [[0, 0, 0, 0, 1, 0, 0, 0, minutesLeft]]
	while (stack.length) {
		const next = stack.pop()!;
		let [ore, clay, obsidian, geode, oreRobots, clayRobots, obsidianRobots, geodeRobots, minutesLeft] = next;

		best = Math.max(best, geode)
		if (minutesLeft === 0) continue;


		const maxOreCost = Math.max(oreBotReq.ore, clayBotReq.ore, obsidianBotReq.ore, geodeBotReq.ore);

		oreRobots = Math.min(oreRobots, maxOreCost)
		ore = Math.min(ore, minutesLeft * maxOreCost - oreRobots * (minutesLeft - 1))

		clayRobots = Math.min(clayRobots, obsidianBotReq.clay)
		clay = Math.min(clay, minutesLeft * obsidianBotReq.clay - clayRobots * (minutesLeft - 1))

		geodeRobots = Math.min(geodeRobots, geodeBotReq.obsidian)
		obsidian = Math.min(obsidian, minutesLeft * geodeBotReq.obsidian - geodeRobots * (minutesLeft - 1))


		const key = [ore, clay, obsidian, geode, oreRobots, clayRobots, obsidianRobots, geodeRobots, minutesLeft].join(',');
		if (seen.has(key)) continue;
		seen.add(key);
		const newMinutes = minutesLeft - 1;
		const [newOre, newClay, newObsidian, newGeode] = [ore + oreRobots, clay + clayRobots, obsidian + obsidianRobots, geode + geodeRobots]
		stack.push([newOre, newClay, newObsidian, newGeode, oreRobots, clayRobots, obsidianRobots, geodeRobots, newMinutes])
		if (ore >= geodeBotReq.ore && obsidian >= geodeBotReq.obsidian) {
			stack.push([newOre - geodeBotReq.ore, newClay, newObsidian - geodeBotReq.obsidian, newGeode, oreRobots, clayRobots, obsidianRobots, geodeRobots + 1, newMinutes])
		}
		else if (ore >= obsidianBotReq.ore && clay >= obsidianBotReq.clay) {
			stack.push([newOre - obsidianBotReq.ore, newClay - obsidianBotReq.clay, newObsidian, newGeode, oreRobots, clayRobots, obsidianRobots + 1, geodeRobots, newMinutes])
		} else {
			if (ore >= clayBotReq.ore) {
				stack.push([newOre - clayBotReq.ore, newClay, newObsidian, newGeode, oreRobots, clayRobots + 1, obsidianRobots, geodeRobots, newMinutes])
			}
			if (ore >= oreBotReq.ore) {
				stack.push([newOre - oreBotReq.ore, newClay, newObsidian, newGeode, oreRobots + 1, clayRobots, obsidianRobots, geodeRobots, newMinutes])
			}
		}
	}
	return best;
}

function solveOne(data: string): any {
	return parseBlueprints(data)
		.reduce((sum, blueprint, i) => sum + bfs(blueprint.ore, blueprint.clay, blueprint.obsidian, blueprint.geode, 24) * (i + 1), 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`), 33);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	return parseBlueprints(data).slice(0, 3)
		.reduce((product, blueprint) => product * bfs(blueprint.ore, blueprint.clay, blueprint.obsidian, blueprint.geode, 32), 1);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
	Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`), 3162);
	console.log(solveTwo(data));
})();
