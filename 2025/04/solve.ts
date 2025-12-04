const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any{
	const world = data.trim().split('\n').map(r => r.split(''));
	const found = []
	let accessible = 0
	for (let r = 0; r < world.length; r++){
		for (let c = 0; c < world[0].length; c++){
			let howManyRollsAround = 0;
			if (world[r][c] !== '@') continue
			for (let ro = -1; ro <= 1; ro++){
				for (let co = -1; co <= 1; co++){
					if (ro === 0 && co === 0) continue;
					const [nr, nc] = [r + ro, c + co];
					const value = world[nr]?.[nc]
					if (value === '@'){
						howManyRollsAround++
					}
				}
			}
			if (howManyRollsAround < 4) {
				accessible++
				found.push([r, c]);
			}
		}
	}
	for (const [r, c] of found){
		world[r][c] = 'x'
	}
	return accessible
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
	const world = data.trim().split('\n').map(r => r.split(''));
	let accessible = 0
	while (true){
		const found = []
		for (let r = 0; r < world.length; r++){
			for (let c = 0; c < world[0].length; c++){
				let howManyRollsAround = 0;
				if (world[r][c] !== '@') continue
				for (let ro = -1; ro <= 1; ro++){
					for (let co = -1; co <= 1; co++){
						if (ro === 0 && co === 0) continue;
						const [nr, nc] = [r + ro, c + co];
						const value = world[nr]?.[nc]
						if (value === '@'){
							howManyRollsAround++
						}
					}
				}
				if (howManyRollsAround < 4) {
					accessible++
					found.push([r, c]);
				}
			}
		}
		for (const [r, c] of found){
			world[r][c] = '.'
		}
		if (!found.length) break
	}
	return accessible
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