const fs = require('fs');
const assert = require('assert');

// for (let r = 0; r < world.length; r++) {
// 	for (let c = 0; c < world[r].length; c++) {
// 		const char = world[r][c];
// 		if (!(char in results)) results[char] = { area: 0, perim: 0 }
// 		results[char].area++
// 		for (const [ro, co] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
// 			const [nr, nc] = [r + ro, c + co];
// 			const neighbor = world[nr]?.[nc];
// 			if (neighbor !== char) results[char].perim++
// 		}
// 	}
// }
// let totalPrice = 0;
// for (const [char, { area, perim }] of Object.entries(results)) {
// 	totalPrice += area * perim
// }
// return totalPrice

const toKey = (r: number, c: number) => {
	return r + '|' + c
}

function floodFill(world: string[][], r: number, c: number, group: { members: Set<string>, area: number, perim: number, char: string }) {
	group.members.add(toKey(r, c))
	group.area++
	for (const [ro, co] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
		const [nr, nc] = [r + ro, c + co];
		const neighbor = world[nr]?.[nc];
		if (neighbor !== group.char) group.perim++
		else {
			const nKey = toKey(nr, nc)
			if (group.members.has(nKey)) continue
			else {
				floodFill(world, nr, nc, group);
			}
		}
	}
}

function solveOne(data: string): any {
	const world = data.replace(/\r/g, '').split('\n').map(l => [...l]);
	const groups: { members: Set<string>, area: number, perim: number, char: string }[] = []
	const results: Record<string, { area: number, perim: number }> = {};
	for (let r = 0; r < world.length; r++) {
		for (let c = 0; c < world[r].length; c++) {
			const char = world[r][c];
			const key = toKey(r, c)
			const existingGroup = groups.find(g => g.char === char && g.members.has(key))
			if (existingGroup) continue
			const group = { members: new Set([key]), area: 0, perim: 0, char }
			floodFill(world, r, c, group)
			groups.push(group)
		}
	}
	let totalPrice = 0;
	for (const { area, perim } of groups) {
		totalPrice += area * perim
	}
	return totalPrice
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`AAAA
BBCD
BBCC
EEEC`.trim()), 140);
	assert.deepStrictEqual(solveOne(`OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`.trim()), 772);
	console.log(solveOne(data));
})();


function floodFillWithFences(world: string[][], r: number, c: number, group: { members: Set<string>, area: number, perim: number, char: string, fences: Set<string> }) {
	group.members.add(toKey(r, c))
	group.area++
	for (const [ro, co] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
		const [nr, nc] = [r + ro, c + co];
		const neighbor = world[nr]?.[nc];
		if (neighbor !== group.char) {
			if (ro === 0) {
				const fc = co === -1 ? c - 0.5 : c + 0.5
				const frs = [r - .5, r + .5]
				for (const fence of [{ r: frs[0], c: fc }, { r: frs[1], c: fc }]) {
					group.fences.add(toKey(fence.r, fence.c))
				}
			} else {
				const fr = ro === -1 ? r - 0.5 : r + 0.5
				const fcs = [c - .5, c + .5]
				for (const fence of [{ r: fr, c: fcs[0] }, { r: fr, c: fcs[1] }]) {
					group.fences.add(toKey(fence.r, fence.c))
				}
			}
			group.perim++
		}
		else {
			const nKey = toKey(nr, nc)
			if (group.members.has(nKey)) continue
			else {
				floodFillWithFences(world, nr, nc, group);
			}
		}
	}
}

function solveTwo(data: string): any {
	const world = data.replace(/\r/g, '').split('\n').map(l => [...l]);
	const groups: { members: Set<string>, area: number, perim: number, char: string, fences: Set<string>, sideCount: number }[] = []
	const results: Record<string, { area: number, perim: number }> = {};
	for (let r = 0; r < world.length; r++) {
		for (let c = 0; c < world[r].length; c++) {
			const char = world[r][c];
			const key = toKey(r, c)
			const existingGroup = groups.find(g => g.char === char && g.members.has(key))
			if (existingGroup) continue
			const group = { members: new Set([key]), area: 0, perim: 0, char, fences: new Set<string>(), sideCount: 0 }
			floodFillWithFences(world, r, c, group)
			groups.push(group)
		}
	}
	for (const group of groups) {
		const fences = [...group.fences].map(f => {
			const [r, c] = f.split('|').map(Number)
			return { r, c }
		})
		const graph: Record<string, Set<string>> = {}
		for (const a of fences) {
			for (const b of fences) {
				if (a === b) continue
				const tKey = toKey(a.r, a.c)
				if (!(tKey in graph)) graph[tKey] = new Set()
				const bKey = toKey(b.r, b.c)
				if (!(bKey in graph)) graph[bKey] = new Set()
				if (a.r === b.r) {
					// horizontal fence
					const cDiff = a.c - b.c
					if (Math.abs(cDiff) !== 1) continue
					const top = { r: a.r - .5, c: (a.c + b.c) / 2 }
					const bottom = { r: a.r + .5, c: (a.c + b.c) / 2 }
					if (world[top.r]?.[top.c] !== world[bottom.r]?.[bottom.c] && [world[top.r]?.[top.c], world[bottom.r]?.[bottom.c]].includes(group.char)) {
						graph[tKey].add(bKey)
						graph[bKey].add(tKey)
					}
				} else if (a.c === b.c) {
					// vertical fence
					const rDiff = (a.r - b.r)
					if (Math.abs(rDiff) !== 1) continue
					const left = { r: (a.r + b.r) / 2, c: a.c - .5 }
					const right = { r: (a.r + b.r) / 2, c: a.c + .5 }
					if (world[left.r]?.[left.c] !== world[right.r]?.[right.c] && [world[left.r]?.[left.c], world[right.r]?.[right.c]].includes(group.char)) {
						graph[tKey].add(bKey)
						graph[bKey].add(tKey)
					}
				}
			}
		}
		const paths = []
		while (Object.keys(graph).length) {
			const path = [Object.keys(graph)[0]]
			const visited = new Set<string>([path[0]]);
			while (true) {
				const current = path.at(-1)!
				current
				const next = [...graph[current] ?? []].find(key => !visited.has(key))
				delete graph[current]
				next
				if (!next) break
				path.push(next)
				visited.add(next)
			}
			paths.push(path.map(f => {
				const [r, c] = f.split('|').map(Number)
				return { r, c }
			}))
		}
		for (const path of paths) {
			path.push(path[0])
			if (group.char === 'C') {
				path
			}
			for (let s = 2; s < path.length; s++) {
				const lastLast = path[s - 2];
				const last = path[s - 1];
				const current = path[s];
				if (lastLast.r === last.r && last.r === current.r) {
					if (group.char === 'C') {
						s
					}
					path.splice(s - 1, 1)
					s--
				} else if (lastLast.c === last.c && last.c === current.c) {
					if (group.char === 'C') {
						s
					}
					path.splice(s - 1, 1)
					s--
				}
			}
			path.splice(-1, 1)
		}
		for (const path of paths) {
			if (group.char === 'A') {
				path
			}
			group.sideCount += path.length
		}
	}
	let totalPrice = 0;
	groups
	for (const { area, perim, sideCount } of groups) {
		totalPrice += area * sideCount
	}
	return totalPrice
}

function floodFillWithFences(world: string[][], r: number, c: number, group: { members: Set<string>, area: number, perim: number, char: string, fences: Set<string>, corners: number }) {
	group.members.add(toKey(r, c))
	group.area += .25
	for (const [cro, crc] of [[-1, -1], [-1, 1], [1, 1], [1, -1]]) {
		const shouldNotBeChar = [[r + cro, c], [r, c + crc]]
		const shouldBeChar = [[r - cro, c], [r, c - crc]];
		if (shouldNotBeChar.every(([r, c]) => world[r]?.[c] !== group.char) && shouldBeChar.every(([r, c]) => world[r]?.[c] === group.char)) {
			group.corners++
		}
		if (world[r + cro]?.[c + crc] !== group.char && shouldNotBeChar.every(([r, c]) => world[r]?.[c] === group.char)) {
			group.corners++
		}
	}
	for (const [ro, co] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
		const [nr, nc] = [r + ro, c + co];
		const neighbor = world[nr]?.[nc];
		if (neighbor !== group.char) {
			if (ro === 0) {
				const fc = co === -1 ? c - 0.5 : c + 0.5
				const frs = [r - .5, r + .5]
				for (const fence of [{ r: frs[0], c: fc }, { r: frs[1], c: fc }]) {
					group.fences.add(toKey(fence.r, fence.c))
				}
			} else {
				const fr = ro === -1 ? r - 0.5 : r + 0.5
				const fcs = [c - .5, c + .5]
				for (const fence of [{ r: fr, c: fcs[0] }, { r: fr, c: fcs[1] }]) {
					group.fences.add(toKey(fence.r, fence.c))
				}
			}
			group.perim++
		}
		else {
			const nKey = toKey(nr, nc)
			if (group.members.has(nKey)) continue
			else {
				floodFillWithFences(world, nr, nc, group);
			}
		}
	}
}

function solveTwo(data: string): any {
	const world = data.replace(/\r/g, '').split('\n').flatMap(l => {
		const row = [...l].flatMap(c => [c, c])
		return [row, row]
	});
	world
	const groups: { members: Set<string>, area: number, perim: number, char: string, fences: Set<string>, sideCount: number, corners: number }[] = []
	for (let r = 0; r < world.length; r++) {
		for (let c = 0; c < world[r].length; c++) {
			const char = world[r][c];
			const key = toKey(r, c)
			const existingGroup = groups.find(g => g.char === char && g.members.has(key))
			if (existingGroup) continue
			const group = { members: new Set([key]), area: 0, perim: 0, char, fences: new Set<string>(), sideCount: 0, corners: 0 }
			floodFillWithFences(world, r, c, group)
			groups.push(group)
		}
	}
	groups
	let totalPrice = 0;
	for (const { area, perim, sideCount, corners, char } of groups) {
		const p = area * corners
		char //?
		area //?
		corners
		p
		totalPrice += area * corners
	}
	return totalPrice
	for (const group of groups) {
		const fences = [...group.fences].map(f => {
			const [r, c] = f.split('|').map(Number)
			return { r, c }
		})
		const graph: Record<string, Set<string>> = {}
		for (const a of fences) {
			for (const b of fences) {
				if (a === b) continue
				const tKey = toKey(a.r, a.c)
				if (!(tKey in graph)) graph[tKey] = new Set()
				const bKey = toKey(b.r, b.c)
				if (!(bKey in graph)) graph[bKey] = new Set()
				if (a.r === b.r) {
					// horizontal fence
					const cDiff = a.c - b.c
					if (Math.abs(cDiff) !== 1) continue
					const top = { r: a.r - .5, c: (a.c + b.c) / 2 }
					const bottom = { r: a.r + .5, c: (a.c + b.c) / 2 }
					if (world[top.r]?.[top.c] !== world[bottom.r]?.[bottom.c] && [world[top.r]?.[top.c], world[bottom.r]?.[bottom.c]].includes(group.char)) {
						graph[tKey].add(bKey)
						graph[bKey].add(tKey)
					}
				} else if (a.c === b.c) {
					// vertical fence
					const rDiff = (a.r - b.r)
					if (Math.abs(rDiff) !== 1) continue
					const left = { r: (a.r + b.r) / 2, c: a.c - .5 }
					const right = { r: (a.r + b.r) / 2, c: a.c + .5 }
					if (world[left.r]?.[left.c] !== world[right.r]?.[right.c] && [world[left.r]?.[left.c], world[right.r]?.[right.c]].includes(group.char)) {
						graph[tKey].add(bKey)
						graph[bKey].add(tKey)
					}
				}
			}
		}
		graph
		const canVisitTimes: Record<string, number> = {};
		for (const key in graph) {
			canVisitTimes[key] = graph[key].size / 2
		}
		const paths = []
		while (Object.keys(graph).length) {
			const completedPotentialPaths = []
			const potentialPaths = [[Object.keys(graph)[0]]]
			while (potentialPaths.length) {
				const path = potentialPaths.pop()!
				//graph
				//path
				const visited: Record<string, number> = {}
				for (const key of path) {
					visited[key] = (visited[key] ?? 0) + 1
				}

				while (true) {
					const current = path.at(-1)!
					if (group.char === 'A' && current === '2.5|2.5') {
						path
						current
						visited[current] //?
						graph[current] //?
					}
					const nexts = [...graph[current] ?? []].filter(key => (visited[key] ?? 0) < canVisitTimes[key])
					delete graph[current]
					const [next, ...otherNexts] = nexts;
					for (const other of otherNexts) {
						potentialPaths.push([...path, other])
					}
					if (!next) break
					path.push(next)
					visited[next] = (visited[next] ?? 0) + 1
				}
				//console.log(visited)
				//graph[path.at(-1)!] //?
				//console.log(path)
				if (path.length === 2) continue
				const objPath = path.map(f => {
					const [r, c] = f.split('|').map(Number)
					return { r, c }
				})
				const first = objPath[0]
				const last = objPath.at(-1);
				objPath
				//console.log(first, last)
				const rDiff = Math.abs(first.r - last.r)
				const cDiff = Math.abs(first.c - last.c)
				//objPath
				if (rDiff + cDiff === 1) {
					//rDiff
					//cDiff
					completedPotentialPaths.push(objPath)
				}
			}
			if (!completedPotentialPaths.length) continue
			completedPotentialPaths
			if (completedPotentialPaths.length <= 2) {
				completedPotentialPaths
				paths.push(completedPotentialPaths[0])
				for (const { r, c } of completedPotentialPaths[0]) {
					delete graph[toKey(r, c)]
				}
			} else {
				const shortestPathLength = Math.min(...completedPotentialPaths.map(p => p.length))
				const shortestPath = completedPotentialPaths.find(p => p.length === shortestPathLength)!
				paths.push(shortestPath)
				for (const { r, c } of shortestPath) {
					delete graph[toKey(r, c)]
				}
			}
		}
		paths
		for (const path of paths) {
			if (group.char === 'A') {
				path
			}
			path.push(path[0])
			for (let s = 2; s < path.length; s++) {
				const lastLast = path[s - 2];
				const last = path[s - 1];
				const current = path[s];
				if (lastLast.r === last.r && last.r === current.r) {
					path.splice(s - 1, 1)
					s--
				} else if (lastLast.c === last.c && last.c === current.c) {
					path.splice(s - 1, 1)
					s--
				}
			}
			path.splice(-1, 1)
			if (group.char === 'A') {
				path
			}
		}
		paths
		for (const path of paths) {
			group.sideCount += path.length
		}
	}
	groups
	/*let totalPrice = 0;
	for (const { area, perim, sideCount, corners } of groups) {
		totalPrice += area * corners
	}
	return totalPrice*/
}

(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`
AAAA
BBCD
BBCC
EEEC`.trim()), 80);
	assert.deepStrictEqual(solveTwo(`EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`), 236);
	assert.deepStrictEqual(solveTwo(`
AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`.trim()), 368);
	assert.deepStrictEqual(solveTwo(`RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`), 1206);
	console.log(solveTwo(data));
})();
