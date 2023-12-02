// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');


type Color = 'red' | 'green' | 'blue'

const parseGame = (line: string) => ({
	id: +line.split(' ')[1].split(':')[0],
	counts: line.split(': ')[1].split('; ')
		.map(revelation => revelation.split(', ')
			.reduce((counts, cube) => {
				const [rawCount, color] = cube.split(' ')

				return {
					...counts,
					[color]: counts[color as Color] + +rawCount
				}
			}, {
				red: 0,
				green: 0,
				blue: 0
			})
		)
})

const parseGames = (data: string) => data.trim().split('\n').map(parseGame)


function solveOne(data: string, bagContents: Record<Color, number>): any {
	return parseGames(data).filter(game => {
		for (const counts of game.counts)
			for (const color of Object.keys(counts) as Color[])
				if (counts[color] > bagContents[color])
					return false;

		return true;
	}).reduce((a, b) => a + b.id, 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	const bagContents = {
		red: 12,
		green: 13,
		blue: 14,
	}
	assert.deepStrictEqual(solveOne(`Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`, bagContents), 8);
	console.log(solveOne(data, bagContents));
})();


function solveTwo(data: string): any {
	return parseGames(data).map(game => {
		const minimumNeeded = {
			red: 0,
			green: 0,
			blue: 0
		}
		for (const counts of game.counts)
			for (const color of Object.keys(counts) as Color[])
				minimumNeeded[color] = Math.max(minimumNeeded[color], counts[color])

		return Object.values(minimumNeeded).reduce((a, b) => a * b, 1);
	}).reduce((a, b) => a + b, 0)
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
