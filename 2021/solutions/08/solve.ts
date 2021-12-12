const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): number {
	const known = new Set([2, 4, 3, 7]);

	let found = 0;
	for (const patterns of [data.trim().split('\n').map(line => line.replace(' | ', ' ').split(' '))].flat()) {
		for (const pattern of patterns.slice(-4)) {
			if (known.has(pattern.length)) found++;
		}
	}
	return found;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
	gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`), 26);
	console.log(solveOne(data));
})();


function solveTwo(data: string): number {
	function normalizePatterns(patterns: string[]): number[] {
		const counts: Record<string, number> = {}
		for (const pattern of patterns) {
			for (const char of pattern) {
				if (!(char in counts)) counts[char] = 0;
				counts[char]++;
			}
		}

		const normalized = new Array(patterns.length).fill(0);
		for (const [i, pattern] of patterns.entries()) {
			for (const [char, count] of Object.entries(counts)) {
				if (pattern.includes(char)) normalized[i] += count
			}
		}
		return normalized;
	}

	const mapping = normalizePatterns([
		'abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg'
	]).reduce<Record<number, number>>((mapping, segment, i) => ({
		...mapping,
		[segment]: i
	}), {});

	let result = 0;
	for (const patterns of [data.trim().split('\n').map(line => line.replace(' | ', ' ').split(' ').map(patterns => [...patterns].sort().join('')))].flat()) {
		const inputs = patterns.slice(0, -4);
		const normalizedInputs = normalizePatterns(inputs);
		result += Number(patterns.slice(-4).map(pattern => mapping[normalizedInputs[inputs.indexOf(pattern)]]).map(String).join(''))
	}
	return result;
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`), 61229);
	console.log(solveTwo(data));
})();
