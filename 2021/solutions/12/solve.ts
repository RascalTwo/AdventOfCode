const fs = require('fs');
const assert = require('assert');


function solve(data: string, smallRevisits: number){
	const smallCaves = new Set<string>();

	const edges: Record<string, Set<string>> = {}
	for (const [origin, dest] of data.trim().split('\n').map(edge => edge.split('-'))){
		if (!(origin in edges)) edges[origin] = new Set();
		if (!(dest in edges)) edges[dest] = new Set();
		edges[origin].add(dest);
		edges[dest].add(origin);
		for (const cave of [origin, dest]){
			if (!['start', 'end'].includes(cave) && cave.toLowerCase() === cave){
				smallCaves.add(cave);
			}
		}
	}
	
	let paths = 0;

	function recur(path: Set<string>, current: string, smalls: Record<string, number>, revisitable: Set<string>){
		if (smallCaves.has(current)){
			if (!(current in smalls)) smalls[current] = 0;
			smalls[current]++;
			revisitable[smalls[current] === 1 ? 'add' : 'delete'](current);
			if (Object.keys(smalls).length - revisitable.size >= smallRevisits) revisitable.clear();
		}

		for (const dest of edges[current]){
			if (dest === 'start' || (!revisitable.has(dest) && smallCaves.has(dest) && path.has(dest))){
				continue
			}
			else if (dest == 'end') paths++
			else recur(new Set([...path, current]), dest, {...smalls}, new Set(revisitable));
		}
	}

	recur(new Set(), 'start', {}, new Set());

	return paths;
}
/*

def solve(data: str, small_revisits: int):

	paths = 0

	stack: List[Tuple[Set[str], str, DefaultDict[str, int], Set[str]]] = [(set(), 'start', collections.defaultdict(int), set())]
	while stack:
		path, current, smalls, can_revisit = stack.pop()

		if current in small_caves:
			smalls[current] += 1
			getattr(can_revisit, 'add' if smalls[current] == 1 else 'remove')(current)
			if len(smalls) - len(can_revisit) >= small_revisits:
				can_revisit.clear()

		for dest in edges[current]:
			# If is small cave that has been visited, but cannot revisit
			if dest == 'start' or (dest not in can_revisit and dest in small_caves and dest in path):
				continue
			if dest == 'end':
				paths += 1
			else:
				stack.append((path | {current}, dest, smalls.copy(), can_revisit.copy()))

	return paths
	*/

function solveOne(data: string): number{
	return solve(data, 0);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`start-A
start-b
A-c
A-b
b-d
A-end
b-end`), 10);
	console.log(solveOne(data));
})();


function solveTwo(data: string): number{
	return solve(data, 1);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`start-A
start-b
A-c
A-b
b-d
A-end
b-end`), 36);
	console.log(solveTwo(data));
})();
