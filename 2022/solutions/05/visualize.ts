import blessed from 'blessed';
import fs from 'fs';
import makePlayer from 'play-sound';

const player = makePlayer();

const wrap = (tag: string, text: string) => `{${tag}}${text}{/${tag}}`
//const wrap = (tag: string, text: string) => `${text}`
// TODO - make it work based on duration and speed
// TODO - toggle for sonic sound
// TODO - crane only go up as far as needed to get to next stack
// TODO - option to skip certain animations (all horizontal frames, all vertical frames, etc)

function doTheThing(data: string) {

	const [rawStack, rawInstructions] = data.split('\n\n');


	const stacks: Record<string, string[]> = {};

	const rawCrates = rawStack.split('\n').reverse();
	const rawIndexes = rawCrates.shift()!;
	for (const { 0: value, ...rest } of rawIndexes.matchAll(/\d+/g)) {
		const index = rest.index!
		stacks[value] = [];
		for (const line of rawCrates) {
			if (line[index - 1] !== '[') break
			stacks[value].push(line.slice(index).split(']')[0]);
		}
	}

	let tallestPossibleStack = (() => {
		const ourStack: Record<string, string[]> = JSON.parse(JSON.stringify(stacks));
		let tallest = Math.max(...Object.values(ourStack).map(arr => arr.length));


		for (const [_, ...instruction] of rawInstructions.matchAll(/move (\d+) from (\d+) to (\d+)/g)) {
			const [count, origin, destination] = instruction.map(Number);
			for (let i = 0; i < count; i++) ourStack[destination].push(ourStack[origin].pop()!);
			tallest = Math.max(tallest, ourStack[destination].length);
		}

		return tallest;
	})();

	const HR = '─'.repeat((Object.keys(stacks).length * 3) + Object.keys(stacks).length - 1)
	const NOOP = <T>(arg: T) => arg


	function stacksToLines(origin?: number, destination?: number) {
		const colorRanges = new Map();
		let bottomRow = '| ';
		for (const [i, key] of Object.keys(stacks).entries()) {
			if (i !== 0) {
				bottomRow += '   ';
			}

			if (i + 1 === origin) colorRanges.set([-2, bottomRow.length], 'blue-fg')
			if (i + 1 === destination) colorRanges.set([-2, bottomRow.length], 'green-fg')
			bottomRow += key;
		}
		const lines: string[] = [
			'└' + HR + '┘',
			bottomRow + ' |'
		];
		for (let i = 0; i < tallestPossibleStack + 3; i++) {
			let line = '|';
			for (const [j, stack] of Object.values(stacks).entries()) {
				if (j !== 0) {
					line += ' ';
				}
				if (i < stack.length) {
					line += '[' + stack[i] + ']';
					const colorName = j + 1 === origin ? 'blue-fg' : j + 1 === destination ? 'green-fg' : 'white-fg'
					colorRanges.set([-(i + 3), line.length - 1], colorName)
					colorRanges.set([-(i + 3), line.length - 2], colorName)
					colorRanges.set([-(i + 3), line.length - 3], colorName)
				} else {
					line += '   ';
				}
			}
			lines.push(line + '|');

		}
		const matrix = [
			'┌' + HR + '┐',
			...lines.reverse()
		].map(line => [...line]);

		matrix[0] = [...`┌` + HR + `┐`]
		matrix[0][CRANE_X] = CRANE_TOP;
		colorRanges.set([0, CRANE_X], 'yellow-fg')
		for (let y = 1; y < CRANE_Y; y++) {
			matrix[y][CRANE_X] = '│';
			colorRanges.set([y, CRANE_X], 'yellow-fg')
		}

		matrix[CRANE_Y].splice(CRANE_X - 1, CRANE.length, ...CRANE);
		for (let o = 0; o < CRANE.length; o++) {
			colorRanges.set([CRANE_Y, CRANE_X - 1 + o], 'yellow-fg')
		}
		if (currentlyCarrying) {
			matrix[CRANE_Y + 1].splice(CRANE_X - 1, 3, '╲', currentlyCarrying, '╱');
			colorRanges.set([CRANE_Y + 1, CRANE_X - 1], 'yellow-fg')
			colorRanges.set([CRANE_Y + 1, CRANE_X], 'yellow-fg')
			colorRanges.set([CRANE_Y + 1, CRANE_X + 1], 'yellow-fg')
		}
		label.top = matrix.length + 1

		for (const [[rawRow, col], colorName] of colorRanges.entries()) {
			const row = rawRow < 0 ? matrix.length + rawRow : rawRow;
			matrix[row][col] = wrap(colorName, matrix[row][col])
		}

		return matrix;
	}

	// Create a screen object.
	const sc = blessed.screen({
		smartCSR: true
	});
	const label = blessed.text({
		top: 0,
		height: 3,
		content: '',
		border: {
			type: 'line'
		},
		tags: true
	})

	const CRANE = `╱ ╲`
	const CRANE_TOP = '┬'
	let CRANE_X = 6;
	let CRANE_Y = 0;
	let currentlyCarrying: string | null = null;
	// x = 2 + (index * 4)

	let lines = stacksToLines();



	const linesToContent = () => lines.map(line => line.join('')).join('\n');

	// Create a box perfectly centered horizontally and vertically.
	const box = blessed.box({
		shrink: true,
		content: linesToContent(),
		tags: true,
	});

	// Append our box to the screen.
	sc.append(box);
	sc.append(label);
	//sc.on('mouse', console.log)


	// Quit on Escape, q, or Control-C.
	sc.key(['escape', 'q', 'C-c'], () => process.exit(0));

	sc.render();

	let MOVE_DELAY = 100;

	(async () => {
		let goingSlow = 4;
		const entries = [...[...rawInstructions.matchAll(/move (\d+) from (\d+) to (\d+)/g)].entries()]
		for (const [i, [_, ...instruction]] of entries) {
			const [count, origin, destination] = instruction.map(Number);
			label.setContent(`Moving ${count} from ${wrap('green-fg', origin.toString())} to ${wrap('blue-fg', destination.toString())} ${((i / entries.length) * 100).toFixed(2).padStart(6, ' ')}%`);
			if (goingSlow--) MOVE_DELAY -= 25
			tallestPossibleStack = Math.max(...Object.values(stacks).map(arr => arr.length))

			lines = stacksToLines(origin, destination);
			box.setContent(linesToContent());
			sc.render();
			for (let c = 0; c < count; c++) {
				let destX = 2 + (origin - 1) * 4;
				let direction = CRANE_X < destX ? 1 : -1;
				while (CRANE_X !== destX) {
					CRANE_X += direction;
					lines = stacksToLines(origin, destination);
					box.setContent(linesToContent());
					sc.render();
					await new Promise((resolve) => setTimeout(resolve, MOVE_DELAY))
				}
				await new Promise((resolve) => setTimeout(resolve, MOVE_DELAY))
				// calculate destY from stack height
				let destY = 3 + tallestPossibleStack - stacks[origin].length;
				while (CRANE_Y !== destY) {
					CRANE_Y++;
					lines = stacksToLines(origin, destination);
					box.setContent(linesToContent());
					sc.render();
					await new Promise((resolve) => setTimeout(resolve, MOVE_DELAY))
				}
				currentlyCarrying = stacks[origin].pop()!;
				lines = stacksToLines(origin, destination);
				box.setContent(linesToContent());
				sc.render();
				await new Promise((resolve) => setTimeout(resolve, MOVE_DELAY))
				while (CRANE_Y !== 0) {
					CRANE_Y--;
					lines = stacksToLines(origin, destination);
					box.setContent(linesToContent());
					sc.render();
					await new Promise((resolve) => setTimeout(resolve, MOVE_DELAY))
				}

				destX = 2 + (destination - 1) * 4;
				direction = CRANE_X < destX ? 1 : -1;
				while (CRANE_X !== destX) {
					CRANE_X += direction;
					lines = stacksToLines(origin, destination);
					box.setContent(linesToContent());
					sc.render();
					await new Promise((resolve) => setTimeout(resolve, MOVE_DELAY))
				}

				destY = 2 + tallestPossibleStack - stacks[destination].length;
				while (CRANE_Y !== destY) {
					CRANE_Y++;
					lines = stacksToLines(origin, destination);
					box.setContent(linesToContent());
					sc.render();
					await new Promise((resolve) => setTimeout(resolve, MOVE_DELAY))
				}

				player.play('visualize.mp3');
				stacks[destination].push(currentlyCarrying!);
				currentlyCarrying = null;
				lines = stacksToLines(origin, destination);
				box.setContent(linesToContent());
				sc.render();
				await new Promise((resolve) => setTimeout(resolve, MOVE_DELAY))
				while (CRANE_Y !== 0) {
					CRANE_Y--;
					lines = stacksToLines(origin, destination);
					box.setContent(linesToContent());
					sc.render();
					await new Promise((resolve) => setTimeout(resolve, MOVE_DELAY))
				}

				await new Promise((resolve) => setTimeout(resolve, MOVE_DELAY))

				tallestPossibleStack = Math.max(...Object.values(stacks).map(arr => arr.length))
			}
		}
	})();
}

doTheThing(fs.readFileSync('input.in').toString());
