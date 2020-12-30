import os
import math

from typing import List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def parse_matrix(data: str) -> List[List[str]]:
	return list(map(list, data.split('\n')))


def solve(matrix: List[List[str]], offset: Tuple[int, int]) -> int:
	x = 0
	y = 0
	trees = 0
	while y < len(matrix) - 1:
		x = (x + offset[0]) % len(matrix[y])
		y += offset[1]

		trees += matrix[y][x] == '#'

	return trees


def solve_one(data: str):
	return solve(parse_matrix(data), (3, 1))


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#''') == 7
	print(solve_one(data))


def solve_two(data: str):
	matrix = parse_matrix(data)
	return math.prod(
		solve(matrix, offset)
		for offset in
		((1, 1), (3, 1), (5, 1), (7, 1), (1, 2))
	)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#''') == 336
	print(solve_two(data))
