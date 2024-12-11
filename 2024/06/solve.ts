const fs = require('fs');
const assert = require('assert');

const charToDir = (char: string) => {
	if (char === '^') return [-1, 0]
	else if (char === '>') return [0, 1]
	else if (char === 'V') return [1, 0]
	else if (char === '<') return [0, -1]
	throw new Error('Bad char: ' + char)
}

const chars = '^>V<'

function solveOne(data: string): any {
	const world = data.split('\n');
	let loc = { r: 0, c: 0, char: '^' }
	for (let r = 0; r < world.length; r++) {
		for (let c = 0; c < world[r].length; c++) {
			if (world[r][c] === '^') {
				loc = { r, c, char: '^' }
				break
			}
		}
	}

	let visited = []
	while (loc.r >= 0 && loc.r < world.length && loc.c >= 0 && loc.c < world[0].length) {
		visited.push({ ...loc })
		const [ro, co] = charToDir(loc.char)
		const [nr, nc] = [loc.r + ro, loc.c + co]
		const inFront = world[nr]?.[nc]
		if (inFront === '#') {
			loc.char = chars[(chars.indexOf(loc.char) + 1) % chars.length]
		} else {
			loc.r = nr;
			loc.c = nc;
		}
	}
	return new Set(visited.map(v => ({ r: v.r, c: v.c })).map(v => JSON.stringify(v))).size
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`), 41);
	console.log(solveOne(data));
})();

function navTheWorldEndsInLoop(loc: { r: number, c: number, char: string }, world: string[][]) {
	let visited = new Set<string>();
	while (loc.r >= 0 && loc.r < world.length && loc.c >= 0 && loc.c < world[0].length) {
		const locJSON = JSON.stringify(loc)
		if (visited.has(locJSON)) {
			return true
		}
		visited.add(locJSON)
		const [ro, co] = charToDir(loc.char)
		const [nr, nc] = [loc.r + ro, loc.c + co]
		const inFront = world[nr]?.[nc]
		if (inFront === '#') {
			loc.char = chars[(chars.indexOf(loc.char) + 1) % chars.length]
		} else {
			loc.r = nr;
			loc.c = nc;
		}
	}
	return false;
}

type Loc2 = { r: number, c: number, char: string }

function isBetween(small: number, large: number, needle: number) {
	if (small > large) {
		[small, large] = [large, small]
	}
	return small <= needle && needle <= large
}

function solveTwo(data: string): any {
	const world = data.split('\n').map(l => [...l]);
	let loc = { r: 0, c: 0, char: '^' }
	for (let r = 0; r < world.length; r++) {
		for (let c = 0; c < world[r].length; c++) {
			if (world[r][c] === '^') {
				loc = { r, c, char: '^' }
				break
			}
		}
	}
	const startingLoc = { ...loc }

	/*
	const pathingLines: { from: { r: number, c: number }, to: { r: number, c: number }, char: string }[] = []

	function moveLocUntilEnd(loc: Loc2) {
		while (loc.r >= 0 && loc.r < world.length && loc.c >= 0 && loc.c < world[0].length) {
			const [ro, co] = charToDir(loc.char)
			const [nr, nc] = [loc.r + ro, loc.c + co]
			const inFront = world[nr]?.[nc]
			if (inFront === '#' || inFront === undefined) return loc
			loc.r = nr
			loc.c = nc
		}
		return loc
	}*/


	/*
	function addPathingLine() {
		const startLoc = moveLocUntilEnd({ ...loc, char: chars[(chars.indexOf(loc.char) + 2) % chars.length] })
		const endLoc = moveLocUntilEnd({ ...loc })
		pathingLines.push({ from: { r: startLoc.r, c: startLoc.c }, to: { r: endLoc.r, c: endLoc.c }, char: endLoc.char })
	}

	addPathingLine()*/

	let visited = []
	/*
	while (loc.r >= 0 && loc.r < world.length && loc.c >= 0 && loc.c < world[0].length) {
		visited.push({ ...loc })
		const [ro, co] = charToDir(loc.char)
		const [nr, nc] = [loc.r + ro, loc.c + co]
		const inFront = world[nr]?.[nc]
		if (inFront === '#') {
			loc.char = chars[(chars.indexOf(loc.char) + 1) % chars.length]

		} else {
			loc.r = nr;
			loc.c = nc;
		}
	}*/


	let obs = new Set<string>()

	visited = []
	loc = { ...startingLoc }
	while (loc.r >= 0 && loc.r < world.length && loc.c >= 0 && loc.c < world[0].length) {
		visited.push({ ...loc })
		const [ro, co] = charToDir(loc.char)
		const [nr, nc] = [loc.r + ro, loc.c + co]
		const inFront = world[nr]?.[nc]

		if (inFront === '.') {
			//const nextChar = chars[(chars.indexOf(loc.char) + 1) % chars.length]
			/*const pathingLinesCanJoin = pathingLines.find(pl => {
				if (pl.char !== nextChar) return false;
				if (pl.from.r === pl.to.r && loc.r === pl.from.r) {
					return isBetween(pl.from.c, pl.to.c, loc.c)
				} else if (pl.from.c === pl.to.c && loc.c === pl.from.c) {
					return isBetween(pl.from.r, pl.to.r, loc.r)
				}
				return false
			})
			if (pathingLinesCanJoin) {*/
			obs.add(JSON.stringify({ r: nr, c: nc }))
			//}
		}

		if (inFront === '#') {
			const nextChar = chars[(chars.indexOf(loc.char) + 1) % chars.length]
			loc.char = nextChar
			//addPathingLine()
		} else {
			loc.r = nr;
			loc.c = nc;
		}
	}

	obs = [...obs].map(s => JSON.parse(s))

	let loopCount = 0
	for (const [i, { r, c }] of obs.entries()) {
		world[r][c] = '#'
		if (navTheWorldEndsInLoop({ ...startingLoc }, world)) {
			loopCount++
		}
		world[r][c] = '.'
	}
	return loopCount
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`.trim()), 6);
	//console.log(solveTwo(data));
})();
