const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any{
	let direction = 50;
	let zeroes = 0
	for (const line of data.trim().split('\n')){
		const direction2 = line[0];
		let change = +line.slice(1)
		//direction2
		//change
		if (direction2 == 'L') change *= -1
		//console.log(direction)
		direction += change;
		while (direction > 99) direction = direction - 100;
		while (direction < 0) direction = direction + 100;
		//console.log({ direction2, change, direction })
		if (direction === 0) zeroes++
	}
	return zeroes
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`), 3);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any{
	let direction = 50;
	let zeroes = 0
	for (const line of data.trim().split('\n')){
		const direction2 = line[0];
		let change = +line.slice(1)
		//direction2
		//change
		//if (direction2 == 'L') change *= -1
		//console.log(direction)
		//console.log(change)
		for (let i = 0; i < change; i++){
			//console.log(direction)
			direction += direction2 == 'L' ? -1 : 1
			//console.log(direction)
			if (direction > 99) {
				//zeroes++
				direction = direction - 100;
			}
			if (direction < 0) {
				//zeroes++
				direction = direction + 100;
			}
			if (direction== 0){
				zeroes++
			}
			//console.log(direction)
		}
		//console.log({ change, direction })
		/*direction += change;
		/*while (direction > 99) {
			zeroes++
			direction = direction - 100;
		}
		while (direction < 0) {
			zeroes++
			direction = direction + 100;
		}*/
		//console.log({ direction2, change, direction })
		//if (direction === 0) zeroes++
	}
	return zeroes
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`), 6);
	assert.deepStrictEqual(solveTwo(`R1000`), 10);
	console.log(solveTwo(data));
})();

export {};