const fs = require('fs');
const assert = require('assert');


function solveOne(data: string): any{
	const maxes = {
		red: 12,
		green: 13,
		blue: 14,
	}
	const games = data.trim().split('\n').map(line => {
		const id = +line.split(' ')[1].split(':')[0];
		const revelations = line.split(': ')[1].split('; ')
			.map(rev => rev.split(', ')
				.map(cube => cube.split(' '))
				.map(([count, color]) => ({ count: +count, color })))
		return { id, revelations }
	})
	const validGames = games.filter(game => {
		for (const rev of game.revelations) {
			const counts: any = {};
			for (const thing of rev) {
				if (!(thing.color in maxes)) throw new Error('bad game')
				counts[thing.color] = (counts[thing.color] ?? 0) + thing.count;
			}
			for (const color in counts) {
				if (counts[color] > maxes[color as keyof typeof maxes]) return false;
			}
		}
		return true;
	})
	return validGames.map(g => g.id).reduce((a, b) => a + b, 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`), 8);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any{
	const maxes = {
		red: 12,
		green: 13,
		blue: 14,
	}
	const games = data.trim().split('\n').map(line => {
		const id = +line.split(' ')[1].split(':')[0];
		const revelations = line.split(': ')[1].split('; ')
			.map(rev => rev.split(', ')
				.map(cube => cube.split(' '))
				.map(([count, color]) => ({ count: +count, color })))
		return { id, revelations }
	})
	const powers = games.map(game => {
		const mostNeeded = {
			red: 0,
			green: 0,
			blue: 0
		}
		for (const rev of game.revelations) {
			const counts: any = {};
			for (const thing of rev) {
				if (!(thing.color in maxes)) throw new Error('bad game')
				counts[thing.color] = (counts[thing.color] ?? 0) + thing.count;
			}
			for (const color in counts) {
				mostNeeded[color as keyof typeof mostNeeded] = Math.max(mostNeeded[color as keyof typeof mostNeeded], counts[color])
			}
		}
		return Object.values(mostNeeded).reduce((a, b) => a * b, 1);
	})
	return powers.reduce((a, b) => a + b, 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`), 2286);
	console.log(solveTwo(data));
})();
