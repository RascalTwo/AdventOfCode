const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any {
	const connections = data.replace(/\r/g, '').split('\n').map(l => {
		const [from, to] = l.split('-')
		return { from, to }
	});
	const graph = {};
	for (const { from, to } of connections) {
		for (const [orig, dest] of [[from, to], [to, from]]) {
			if (!(orig in graph)) graph[orig] = []
			graph[orig].push(dest)
		}
	}

	graph


	const nodes = [...new Set(connections.flatMap(c => [c.from, c.to]))]
	const threes = new Set()
	for (const aNode of nodes) {
		for (const bNode of graph[aNode]) {
			for (const cNode of graph[aNode]) {
				if (bNode === cNode) continue
				if (graph[bNode].includes(cNode)) {
					threes.add([aNode, bNode, cNode].sort().join('|'))
				}
			}
		}
	}
	return [...threes].filter(t => t.split('|').some(c => c.startsWith('t'))).length
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

function bronKerbosch(graph: Record<string, Set<string>>, current: Set<string>, possible: Set<string>, X: Set<string>, results: Set<string>[]) {
	if (!possible.size && !X.size) {
		results.push(current)
		return
	}
	for (const V of possible) {
		bronKerbosch(graph, new Set([...current, V]), intersectionOf(possible, graph[V]), intersectionOf(X, graph[V]), results)
		possible.delete(V)
		X.add(V)
	}
}



function solveTwo(data: string): any {
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

	const results: Set<string>[] = []
	bronKerbosch(graph, new Set(), new Set(Object.keys(graph)), new Set(), results)
	results
	return [...[...results.values()].reduce((a, b) => {
		return a.size > b.size ? a : b
	})].sort().join(',')
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
