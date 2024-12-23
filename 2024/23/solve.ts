const fs = require('fs');
const assert = require('assert');

function parseGraph(data: string) {
	const connections = data.replace(/\r/g, '').split('\n').map(l => {
		const [from, to] = l.split('-')
		return { from, to }
	});

	const graph: Record<string, Set<string>> = {};
	for (const { from, to } of connections) {
		for (const [orig, dest] of [[from, to], [to, from]]) {
			if (!(orig in graph)) graph[orig] = new Set()
			graph[orig].add(dest)
		}
	}
	return graph
}

function solveOne(data: string): any {
	const graph = parseGraph(data)

	const setsOfThrees = new Set<string>()
	const nodes = Object.keys(graph)
	for (const aNode of nodes) {
		for (const bNode of graph[aNode]) {
			for (const cNode of graph[aNode]) {
				if (bNode === cNode) continue
				if (graph[bNode].has(cNode)) {
					setsOfThrees.add([aNode, bNode, cNode].sort().join('|'))
				}
			}
		}
	}

	return [...setsOfThrees].filter(set => set.split('|').some(computer => computer.startsWith('t'))).length
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`.trim()), 7);
	console.log(solveOne(data));
})();


function intersectionOf(a: Set<string>, b: Set<string>) {
	return new Set([...a].filter(ai => b.has(ai)))
}

function* bronKerbosch(graph: Record<string, Set<string>>, current: Set<string>, possible: Set<string>, X: Set<string>): Generator<Set<string>> {
	if (!possible.size && !X.size) {
		yield current
	}

	for (const V of possible) {
		yield* bronKerbosch(graph, new Set([...current, V]), intersectionOf(possible, graph[V]), intersectionOf(X, graph[V]))
		possible.delete(V)
		X.add(V)
	}
}



function solveTwo(data: string): any {
	const graph = parseGraph(data);

	let largest = new Set<string>()
	for (const current of bronKerbosch(graph, new Set(), new Set(Object.keys(graph)), new Set())) {
		if (current.size > largest.size) largest = current
	}
	return [...largest].sort().join(',')
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`ka-co
ta-co
de-co
ta-ka
de-ta
ka-de`.trim()), 'co,de,ka,ta');
	assert.deepStrictEqual(solveTwo(`
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`.trim()), 'co,de,ka,ta');
	console.log(solveTwo(data));
})();

export { }