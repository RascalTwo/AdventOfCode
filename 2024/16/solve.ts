const fs = require('fs');
const assert = require('assert');

// NESW
const DIRECTIONS = [[-1, 0], [0, 1], [1, 0], [0, -1]]

type Coordinate = { r: number, c: number }
type Vector = Coordinate & { directionI: number }

function adjustArrayIndex(array: unknown[], index: number, change: number){
	const newIndex = (index + change) % array.length;
	return newIndex < 0 ? newIndex + array.length : newIndex
}

function stringifyVector(vector: Vector){
	return vector.r + '|' + vector.c + '|' + vector.directionI
}

function solveOne(data: string): any{
	const world = data.split('\n').map(row => [...row]);
	let start: Vector = { r: -1, c: -1, directionI: -1 };
	let end: Coordinate = { r: -1, c: -1 };

	for (let r = 0; r < world.length; r++){
		for (let c = 0; c < world[r].length; c++){
			const character = world[r][c];
			if (character === 'S'){
				start = { r, c, directionI: 1 }
				world[r][c] = '.'
			}
			if (character === 'E'){
				end = { r, c }
				world[r][c] = '.'
			}
		}
	}

	const scores: { [vector: string]: number} = {};
	scores[stringifyVector(start)] = 0

	const queue: [number, Vector][] = [[0, start]];

	while (queue.length){
		queue.sort((a, b) => b[0] - a[0]);
		const [score, current] = queue.pop()!
		
		const options = [
			[1001, adjustArrayIndex(DIRECTIONS, current.directionI, -1)],
			[1, current.directionI],
			[1001, adjustArrayIndex(DIRECTIONS, current.directionI, 1)],
		]

		for (const [scoreIncrease, directionI] of options){
			const [ro, co] = DIRECTIONS[directionI];
			const [nr, nc] = [current.r + ro, current.c + co];
			if (world[nr]?.[nc] === '.'){
				const newScore = score + scoreIncrease;
				const neighborVector = { r: nr, c: nc, directionI }
				const neighbor = stringifyVector(neighborVector)
				const prevScore = scores[neighbor] ?? Number.MAX_SAFE_INTEGER;
				if (newScore < prevScore){
					scores[neighbor] = newScore;
					queue.push([newScore, neighborVector])
				}
			}
		}
	}

	let endScores = []

	for (let directionI = 0; directionI < DIRECTIONS.length; directionI++){
		const endVector = { ...end, directionI };
		const endScore = scores[stringifyVector(endVector)]
		if (endScore) endScores.push(endScore)
	}

	const minimumEndScore = Math.min(...endScores)
	return minimumEndScore
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`.trim()), 7036);
	assert.deepStrictEqual(solveOne(`#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
	`.trim()), 11048);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any{
	const world = data.split('\n').map(row => [...row]);
	let start: Vector = { r: -1, c: -1, directionI: -1 };
	let end: Coordinate = { r: -1, c: -1 };

	for (let r = 0; r < world.length; r++){
		for (let c = 0; c < world[r].length; c++){
			const character = world[r][c];
			if (character === 'S'){
				start = { r, c, directionI: 1 }
				world[r][c] = '.'
			}
			if (character === 'E'){
				end = { r, c }
				world[r][c] = '.'
			}
		}
	}

	const scores: { [vector: string]: number} = {};
	scores[stringifyVector(start)] = 0

	const queue: [number, Vector][] = [[0, start]];
	const previouses: Record<string, Set<string>> = {}

	while (queue.length){
		queue.sort((a, b) => b[0] - a[0]);
		const [score, current] = queue.pop()!
		const currentString = stringifyVector(current)
		
		const options = [
			[1001, adjustArrayIndex(DIRECTIONS, current.directionI, -1)],
			[1, current.directionI],
			[1001, adjustArrayIndex(DIRECTIONS, current.directionI, 1)],
		]

		for (const [scoreIncrease, directionI] of options){
			const [ro, co] = DIRECTIONS[directionI];
			const [nr, nc] = [current.r + ro, current.c + co];
			if (world[nr]?.[nc] === '.'){
				const newScore = score + scoreIncrease;
				const neighborVector = { r: nr, c: nc, directionI }
				const neighbor = stringifyVector(neighborVector)
				const prevScore = scores[neighbor] ?? Number.MAX_SAFE_INTEGER;
				if (newScore < prevScore){
					scores[neighbor] = newScore;
					queue.push([newScore, neighborVector])
					previouses[neighbor] = new Set([currentString])
				} else if (newScore <= prevScore){
					previouses[neighbor].add(currentString)
				}
			}
		}
	}


	let bestEndScore = Number.MAX_SAFE_INTEGER
	let bestEndDirectionI = -1;
	for (let directionI = 0; directionI < DIRECTIONS.length; directionI++){
		const endVector = { ...end, directionI };
		const endScore = scores[stringifyVector(endVector)]
		if (endScore < bestEndScore){
			bestEndScore = endScore
			bestEndDirectionI = directionI
		}
	}
	
	const stack = [stringifyVector({ ...end, directionI: bestEndDirectionI })]
	const keepingTrack = new Set<string>(stack);

	while (stack.length){
		const current = stack.pop()!
		for (const next of previouses[current] ?? []){
			keepingTrack.add(next.split('|').slice(0, -1).join('|'))
			stack.push(next)
		}
	}

	return keepingTrack.size
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
		`.trim()), 45);
			assert.deepStrictEqual(solveTwo(`#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
			`.trim()), 64);
	console.log(solveTwo(data));
})();
