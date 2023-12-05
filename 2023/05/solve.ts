// @ts-ignore
const fs = require('fs');
// @ts-ignore
const assert = require('assert');



function solveOne(data: string): any {
	const seeds = data.split('\n')[0].split(': ')[1].split(' ').map(Number);

	const maps = data.trim().split('\n\n').slice(1).map(str => {
		const lines = str.split('\n')
		const [from, to] = lines[0].split(' ')[0].split('-to-');
		const ranges = lines.slice(1).map(line => line.split(' ').map(Number)).map(([a, b, c]) => ({ destRangeStart: a, sourceRangeStart: b, rangeLength: c }))
		/*const map = new Map();
		for (const range of ranges) {
			for (let i = 0; i < range.rangeLength; i++) {
				const dest = range.destRangeStart + i;
				map.set(range.sourceRangeStart + i, dest);
			}
		}*/
		function mapNumToNewNum(num: number) {
			for (const range of ranges) {
				const min = range.sourceRangeStart;
				const max = range.sourceRangeStart + range.rangeLength;
				if (num >= min && num <= max) {
					const offset = num - min
					return range.destRangeStart + offset;
				}
			}
			return num;
		}
		return { from, to, ranges, mapNumToNewNum };
	})

	//const paths = [];
	const locations = []
	for (const seed of seeds) {
		//	const path: any = [seed]
		let value = seed;
		for (const map of maps) {
			//value = map.map.get(value) ?? value
			value = map.mapNumToNewNum(value);
			//			path.push([map.from, map.to, value])
		}
		//paths.push(path)
		locations.push(value)
	}

	//console.log(paths);

	return Math.min(...locations)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`), 35);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const rawSeeds = data.split('\n')[0].split(': ')[1].split(' ').map(Number);

	const maps = data.trim().split('\n\n').slice(1).map(str => {
		const lines = str.split('\n')
		const ranges = lines.slice(1).map(line => line.split(' ').map(Number)).map(([a, b, c]) => ({ destRangeStart: a, sourceRangeStart: b, rangeLength: c }))
		return { ranges };
	})

	const twoSeeds = []
	for (let i = 0; i < rawSeeds.length; i += 2) {
		const start = rawSeeds[i];
		const num = rawSeeds[i + 1]
		twoSeeds.push({ start, num })
	}
	twoSeeds.sort((a, b) => a.num - b.num)
	console.log(twoSeeds)

	//const finds = []
	let minLoc = Number.MAX_SAFE_INTEGER
	let minLocBatch = null;
	for (const { start, num } of twoSeeds) {
		//for (let j = 0; j < num; j += num - 1) {
		//for (let j = 205768580 / 10; j < 205768580 + 205768580 / 10; j++) {
		for (let j = 0; j < num; j++) {
			const seed = start + j
			if (j % 10000000 === 0) console.log({ j, num, percent: (j / num * 100).toFixed(2), minLoc })
			// Used to monitor progress and attempt with low values without waiting
			let value = seed;
			for (const map of maps) {
				let foundDest = null;
				for (const range of map.ranges) {
					if (value >= range.sourceRangeStart && value <= range.sourceRangeStart + range.rangeLength) {
						const offset = value - range.sourceRangeStart
						foundDest = range.destRangeStart + offset;
						break;
					}
				}
				value = foundDest ?? value;
			}
			if (minLocBatch === null) minLocBatch = { start, num }
			else if (value <= minLoc && minLocBatch.start !== start) {
				console.log('NOT IN', minLocBatch)
				// Used this logging to manually remove the incorrect seed pairs from the input
				minLocBatch = { start, num }
			}
			minLoc = Math.min(minLoc, value)
			//finds.push({ i, j, value, start, num })
		}
	}
	//finds.sort((a, b) => a.value - b.value)
	//console.log(finds);

	return minLoc
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`), 46);
	console.log(solveTwo(data));
})();
