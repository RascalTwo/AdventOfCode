const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	const world = data.trim().split('\n').map(l => l.trim().split(''));
	const vizWorld = world.map(r => [...r])
	let splits = new Set<string>();
	const beamed = new Set<string>();
	const activeBeams = [[0, world[0].indexOf('S')] as [number, number]];
	while (activeBeams.length) {
		let [r, c] = activeBeams.pop()!;
		let stop = false
		while (true) {
			if (world[r]?.[c] === undefined) {
				break
			}
			if (world[r][c] === '^') {
				splits.add(JSON.stringify([r, c]))
				stop = true
				activeBeams.push([r, c - 1])
				activeBeams.push([r, c + 1])
			}
			if (beamed.has(JSON.stringify([r, c]))) {
				break;
			}
			vizWorld[r][c] = '|'
			beamed.add(JSON.stringify([r, c]))
			r++;
			if (stop) break;
		}
	}
	//console.log(vizWorld.map(r => r.join('')).join('\n'))
	return splits.size
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............
`), 21);
	console.log(solveOne(data));
	// 1626
})();


function solveTwo2(data: string): any {
	const world = data.trim().split('\n').map(l => l.trim().split(''));
	const vizWorld = world.map(r => [...r])
	let timelines = 0;

	const paths: { path: [number, number][], count: number }[] = [{ path: [[0, world[0].indexOf('S')]], count: 1 }];
	while (paths.length) {
		const current = paths.pop()!;
		//console.log(current.path)
		let [r, c] = current.path.at(-1)!;
		const dupPaths = new Set<string>();
		let stop = false
		while (true) {
			if (world[r]?.[c] === undefined) {
				timelines += current.count;
				current.path //?
				break
			}
			if (world[r][c] === '^') {
				stop = true
				const newPaths = [[...current.path.slice(0, -1), [r, c - 1]], [...current.path.slice(0, -1), [r, c + 1]]]
				for (const newPath of newPaths.slice()) {
					const nextLoc = newPath.at(-1)!.join(',')
					console.log(nextLoc)
					if (nextLoc === '6,8') {
						console.log(newPath)
					}
					const existingPath = paths.find(p => {
						if (nextLoc === '6,8') {
							console.log(p.path.map(pair => pair.join(',')), nextLoc)
						}
						return p.path.map(pair => pair.join(',')).join('-').includes(nextLoc)
					})
					if (existingPath) {
						existingPath.count++;
						newPaths.splice(newPaths.indexOf(newPath), 1)
					}
				}
				for (const newPath of newPaths) {
					paths.push({ count: 1, path: newPath })
				}
			}
			vizWorld[r][c] = '|'
			r++;
			current.path.push([r, c])
			if (stop) break;
		}
	}
	console.log(vizWorld.map(r => r.join('')).join('\n'))
	return timelines
}

function solveTwo(data: string): any {
	const world = data.trim().split('\n').map(l => l.trim().split(''));
	const vizWorld = world.map(r => [...r])

	let timelines = 0
	let columnCounts = world[0].map(c => +(c === 'S'))
	let r = 0;
	while (world[r]){
		let nextColumnCounts = world[0].map(() => 0)
		for (let c = 0; c < columnCounts.length; c++){
			const count = columnCounts[c]
			if (count){
				const next = world[r+1]?.[c];
				if (!next) timelines += count;
				else {
					if (next === '.') nextColumnCounts[c] += count;
					else if (next === '^'){
						nextColumnCounts[c-1] += count
						nextColumnCounts[c+1] += count
					}
				}
			}
		}
		columnCounts.splice(0, columnCounts.length, ...nextColumnCounts)
		r++
	}
	return timelines;
}
/*
.......S.......
.......|.......
......|^.......
......|........
.....|^.^......
*/
/*
.......1.......
.......1.......
......111......

......1.1......
.....11211.....
*/


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`), 40);
	console.log(solveTwo(data));
})();

export { };