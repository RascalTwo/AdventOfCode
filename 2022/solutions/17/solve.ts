const fs = require('fs');
const assert = require('assert');


const rocks = [
	[
		['#', '#', '#', '#']
	],
	[
		['', '#', ''],
		['#', '#', '#'],
		['', '#', ''],
	],
	[
		['', '', '#'],
		['', '', '#'],
		['#', '#', '#'],
	],
	[
		['#'],
		['#'],
		['#'],
		['#'],
	],
	[
		['#', '#'],
		['#', '#'],
	],
]

async function solveOne(data: string, GOAL: number) {
	let ji = 0;
	const jets = data.split('');
	let ri = 0;
	const world = new Set<string>();
	const patterns = new Map();
	let additionalHeight = 0;
	let rocksStopped = 0;

	const getHeight = () => {
		let highestPointInWorld = 0;
		for (const key of world) {
			const [r] = key.split(',').map(Number);
			if (r > highestPointInWorld) highestPointInWorld = r;
		}
		return highestPointInWorld + 1;
	}

	while (rocksStopped < GOAL) {
		const shape = rocks[ri++]
		if (ri >= rocks.length) ri = 0;
		const rock = {
			shape,
			r: getHeight() + (rocksStopped ? 3 : 2) + shape.length - 1,
			c: 2,
			width: shape[0].length,
			solidify: false,
			generateCoordinates() {
				const coordinates = [];
				for (const [rr, row] of this.shape.entries()) {
					for (const [cc, char] of row.entries()) {
						if (!char) continue
						coordinates.push([this.r - rr, this.c + cc])
					}
				}
				return coordinates;
			}
		}
		async function visualize(){
			return
			console.clear();
			let str = '';
			const rockCoords = rock.generateCoordinates()
			const highestRockCoord = rockCoords.reduce((acc, [r]) => Math.max(acc, r), 0)
			for (let r = Math.max(getHeight(), highestRockCoord); r >= 0; r--) {
				str += '|'
				for (let c = 0; c < 7; c++) {
					if (rockCoords.some(([rr, cc]) => rr === r && cc === c)) str += 'O';
					else if (world.has(`${r},${c}`)) str += '#';
					else str += '.';
				}
				str += '|\n';
			}
			str += `+---${ji.toString().padStart(2, '0')}--+`
			console.log(str);
			await new Promise(resolve => setTimeout(resolve, 100));
		}
		await visualize();
		while (!rock.solidify) {
			const jet = jets[ji++];
			if (ji >= jets.length) ji = 0;

			const coordinates = rock.generateCoordinates()
			if (jet === '<') {
				if (rock.c !== 0) {
					const newPoints = coordinates.map(([r, c]) => [r, c - 1])
					if (newPoints.some(([r, c]) => world.has(`${r},${c}`))) { }
					else rock.c--;
				}
			} else if (jet === '>') {
				if (rock.c + rock.width < 7) {
					const newPoints = coordinates.map(([r, c]) => [r, c + 1])
					if (newPoints.some(([r, c]) => world.has(`${r},${c}`))) { }
					else rock.c++;
				}
			}
			await visualize()
			coordinates.splice(0, coordinates.length, ...rock.generateCoordinates());
			const newPoints = coordinates.map(([r, c]) => [r - 1, c])
			if (newPoints.some(([r, c]) => r < 0 || world.has(`${r},${c}`))) rock.solidify = true
			else rock.r--;
			await visualize()
		}
		for (const [rr, row] of rock.shape.entries()) {
			for (const [cc, char] of row.entries()) {
				if (!char) continue
				world.add(`${rock.r - rr},${rock.c + cc}`);
			}
		}
		await visualize()
		const highestPointInWorld = getHeight()
		let patternKey = `${ji}|${ri}`;
		for (let r = highestPointInWorld; r >= highestPointInWorld - 10; r--) {
			let row = '';
			for (let c = 0; c < 7; c++) {
				if (world.has(`${r},${c}`)) row += '#';
				else row += '.';
			}
			patternKey += `|${row}`;
		}
		if (patterns.has(patternKey)) {
			const stuff = patterns.get(patternKey);
			const rocksChanges = rocksStopped - stuff.rocksStopped;
			const highestPointChanges = highestPointInWorld - stuff.highestPointInWorld;
			const cycles = Math.floor((GOAL - stuff.rocksStopped) / rocksChanges) - 1;
			additionalHeight += cycles * highestPointChanges;
			rocksStopped += cycles * rocksChanges;
		}
		else patterns.set(patternKey, { rocksStopped, highestPointInWorld })
		rocksStopped++;
	}

	return additionalHeight + getHeight();
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	solveOne('>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>', 2022)
		.then(console.log)
		.then(() => solveOne(data, 2022))
		.then(console.log)
		.then(() => solveOne(data, 1_000_000_000_000))
		.then(console.log)
})();

function solveTwo(data: string): any {
	return true;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	//assert.deepStrictEqual(solveTwo(``), true);
	//console.log(solveTwo(data));
})();
