const fs = require('fs');
const assert = require('assert');

function countAdjacentCharacters(world: string[][], r: number, c: number): Record<string, number>{
	const counts: Record<string, number> = {};
	for (let ro = -1; ro <= 1; ro++){
		for (let co = -1; co <= 1; co++){
			if (ro === 0 && co === 0) continue;
			const value = world[r + ro]?.[c + co];
			if (value !== undefined){
				counts[value] = (counts[value] ?? 0) + 1
			}
		}
	}
	return counts;
}

function solve(data: string, processRepetition: number): any{
	const world = data.trim().split('\n').map(r => r.split(''));

	let rollsRemoved = 0
	for (let _ = 0; _ < processRepetition; _++){
		const accessibleRolls = []
		for (let r = 0; r < world.length; r++){
			for (let c = 0; c < world[0].length; c++){
				if (world[r][c] === '@' && (countAdjacentCharacters(world, r, c)['@'] ?? 0) < 4){
					accessibleRolls.push([r, c]);
				}
			}
		}

		for (const [r, c] of accessibleRolls){
			world[r][c] = '.'
		}
		rollsRemoved += accessibleRolls.length

		if (!accessibleRolls.length) break
	}
	return rollsRemoved
}


function solveOne(data: string): any{
	return solve(data, 1);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`), 13);
	console.log(solveOne(data));
})();



function solveTwo(data: string): any{
	return solve(data, Number.MAX_SAFE_INTEGER)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`), 43);
	console.log(solveTwo(data));
})();

export {};