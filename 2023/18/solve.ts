import { rawListeners } from "process";

const fs = require('fs');
const assert = require('assert');

type Move = {
	direction: string;
	steps: number
}

function solve(moves: Move[]) {
	let traveled = 0
	let current = [0, 0];
	const corners = [current];
	for (const move of moves) {
		let [ro, co] = move.direction === 'R' ? [0, 1] : move.direction === 'L' ? [0, -1] : move.direction === 'U' ? [1, 0] : move.direction === 'D' ? [-1, 0] : [0, 0];
		corners.push(current = [current[0] + ro * move.steps, current[1] + co * move.steps]);
		traveled += move.steps;
	}

	let area = traveled / 2 + 1
	for (let i = 1; i < corners.length; i++)
		area += (corners[i][1] * corners[i - 1][0] - corners[i][0] * corners[i - 1][1]) / 2;
	return area;
}


function solveOne(data: string, center: [number, number]): any {
	return solve(data.trim().split('\n').map((line: string) => {
		const [direction, steps] = line.split(' ');
		return { direction, steps: Number(steps) };
	}));
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`, [3, -3]), 62);
	console.log(solveOne(data, [3, -3]));
})();


function solveTwo(data: string): any {
	return solve(data.trim().split('\n').map((line: string) => {
		const [_, __, rawColor] = line.split(' ');
		const steps = parseInt(rawColor.slice(2, -2), 16);
		const direction = ['R', 'D', 'L', 'U'][+rawColor.at(-2)!];
		return { direction, steps }
	}))
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`), 952408144115);
	console.log(solveTwo(data));
})();
