const fs = require('fs');
const assert = require('assert');


type Invalid = [string, number]

type Incomplete = string[]

const parseChunks = (data: string, getInvalid: boolean = false, getIncomplete: boolean = false, pairs: Record<string, string> = { '(': ')', '[': ']', '{': '}', '<': '>' }): [Invalid[], Incomplete[]] => {
	const invalid: Invalid[] = [];
	const incomplete: Incomplete[] = [];

	if (!getInvalid && !getIncomplete) return [invalid, incomplete];

	const pairValues = new Set(Object.values(pairs));

	for (const line of data.trim().split('\n')) {
		const opens: string[] = [];
		let isInvalid = false;
		for (const [i, chunk] of [...line].entries()) {
			if (chunk in pairs) opens.push(chunk);
			else if (pairValues.has(chunk)) {
				if (pairs[opens.pop()!] === chunk) continue;
				if (getInvalid) invalid.push([line, i])
				isInvalid = true;
				break;
			}
		}
		if (isInvalid) continue;
		if (opens.length && getIncomplete) incomplete.push(opens.reverse().map(open => pairs[open]))
	}

	return [invalid, incomplete]
}

function solveOne(data: string): number {
	const points: Record<string, number> = {
		')': 3,
		']': 57,
		'}': 1197,
		'>': 25137
	};

	const invalidChars: Record<string, number> = {};
	for (const char of parseChunks(data, true)[0].map(([line, i]) => line[i])) {
		if (!(char in invalidChars)) invalidChars[char] = 0;
		invalidChars[char] += 1;
	}

	return Object.entries(invalidChars)
		.map(([char, count]) => count * points[char]!)
		.reduce((total, num) => total + num);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`), 26397);
	console.log(solveOne(data));
})();


function solveTwo(data: string): number {
	const points: Record<string, number> = {
		')': 1,
		']': 2,
		'}': 3,
		'>': 4
	}

	const results = [];
	for (const missing of parseChunks(data, false, true)[1]) {
		let result = 0;
		for (const chunk of missing) {
			result *= 5;
			result += points[chunk]!
		}
		results.push(result);
	}

	return results.sort((a, b) => a - b)[Math.floor(results.length / 2)];
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`), 288957);
	console.log(solveTwo(data));
})();
