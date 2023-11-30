const fs = require('fs');
const colors = require('colors/safe');

const data = fs.readFileSync(__dirname + '/input.in').toString();

const parseSectionRanges = (data: string): [[number, number], [number, number]][] => data.split('\n').map(line =>
	line.split(',').map(p => p.split('-').map(Number) as [number, number]) as [[number, number], [number, number]]);


// TODO - reorder inputs based on first
// TODO - option for live drawing of the line

(async () => {
	let longestLine = -Infinity;
	for (const [e1, e2] of parseSectionRanges(data)) {
		longestLine = Math.max(longestLine, e1[1], e2[1]);
	}

	let part1 = 0;
	let part2 = 0;
	for (const line of data.split('\n')) {
		const counts = new Map();
		const chars = Array.from({ length: longestLine + 1 }, () => '┈');
		const [e1, e2] = parseSectionRanges(line)[0];
		const isWithin = (e1[0] <= e2[0] && e1[1] >= e2[1] || e2[0] <= e1[0] && e2[1] >= e1[1])
		const isOverlapping = ((e1[0] <= e2[0] && e1[1] >= e2[1] || e2[0] <= e1[0] && e2[1] >= e1[1]) || (e1[0] <= e2[0] && e1[1] >= e2[0] || e2[0] <= e1[0] && e2[1] >= e1[0]));
		part1 += +isWithin;
		part2 += +isOverlapping;
		for (let i = e1[0]; i <= e1[1]; i++) {
			if (i === e1[0]) chars[i] = '┌';
			else if (i === e1[1]) chars[i] = '┐';
			else if (chars[i] === '┈') chars[i] = '─'
			counts.set(i, (counts.get(i) || 0) + 1);
		}
		for (let i = e2[0]; i <= e2[1]; i++) {
			if (i === e2[0]) chars[i] = '└';
			else if (i === e2[1]) chars[i] = '┘';
			else if (chars[i] === '┈') chars[i] = '─'
			counts.set(i, (counts.get(i) || 0) + 1);
		}
		if (e1[0] === e2[0]) {
			if (chars[e1[0] - 1] === '┈') chars[e1[0]] = '├';
			else if (chars[e1[0] + 1] === '┈') chars[e1[0]] = '┤';
			else chars[e1[0]] = '┼';
		}
		if (e1[1] === e2[1]) {
			if (chars[e1[1] - 1] === '┈') chars[e1[1]] = '├';
			else if (chars[e1[1] + 1] === '┈') chars[e1[1]] = '┤';
			else chars[e1[1]] = '┼';
		}
		if (e1[0] === e2[1]) {
			if (chars[e1[0] - 1] === '┈') chars[e1[0]] = '├';
			else if (chars[e1[0] + 1] === '┈') chars[e1[0]] = '┤';
			else chars[e1[0]] = '┼';
		}
		if (e1[1] === e2[0]) {
			if (chars[e1[1] - 1] === '┈') chars[e1[1]] = '├';
			else if (chars[e1[1] + 1] === '┈') chars[e1[1]] = '┤';
			else chars[e1[1]] = '┼';
		}
		// if character before and after e0[0] is not ┈, then it's a ┤
		if (chars[e1[0] - 1] !== '┈' && chars[e1[0] + 1] !== '┈') chars[e1[0]] = '┬';
		if (chars[e1[1] - 1] !== '┈' && chars[e1[1] + 1] !== '┈') chars[e1[1]] = '┬';
		if (chars[e2[0] - 1] !== '┈' && chars[e2[0] + 1] !== '┈') chars[e2[0]] = '┴';
		if (chars[e2[1] - 1] !== '┈' && chars[e2[1] + 1] !== '┈') chars[e2[1]] = '┴';
		for (const [index, count] of counts) {
			if (count === 2) chars[index] = colors.green(chars[index]);
			// if index within e1
			if (index >= e1[0] && index <= e1[1]) {
				chars[index] = colors.red(chars[index]);
			}
			if (index >= e2[0] && index <= e2[1]) {
				chars[index] = colors.blue(chars[index]);
			}
		}

		let e1S = colors.red;
		let e1E = colors.red;
		let e2S = colors.blue;
		let e2E = colors.blue;
		if (isWithin) {
			// if e1 is within e2
			if (e1[0] >= e2[0] && e1[1] <= e2[1]) {
				e1S = colors.green;
				e1E = colors.green;
			}
			// if e2 is within e1
			if (e2[0] >= e1[0] && e2[1] <= e1[1]) {
				e2S = colors.green;
				e2E = colors.green;
			}
		} else if (isOverlapping){
			e1E = colors.green;
			e2S = colors.green;
		}

		process.stdout.write(`${e1S(e1[0].toString().padStart(2, '0'))}-${e1E(e1[1].toString().padStart(2, '0'))},${e2S(e2[0].toString().padStart(2, '0'))}-${e2E(e2[1].toString().padStart(2, '0'))} ${chars.join('')} P1: ${part1.toString().padStart(4, '0')} P2: ${part2.toString().padStart(4, '0')}\n`.replace(/┈/g, ' '));
		await new Promise(resolve => setTimeout(resolve, 100));
	}
})();
