import os
import math


DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	matrix = [list(row) for row in data.strip().split('\n')]
	x = 0
	y = 0
	trees = 0
	while y != len(matrix) - 1:
		y += 1
		x += 3
		if x >= len(matrix[y]):
			x = x - len(matrix[y])

		if matrix[y][x] == '#':
			trees += 1
		matrix[y][x] = 'O'

	return trees


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
.#..#...#.#
''') == 7
	print(solve_one(data))


def solve_two(data: str):
	matrix = [list(row) for row in data.strip().split('\n')]
	all_trees = []
	for xo, yo in [(1, 1), (3, 1), (5, 1), (7, 1), (1, 2)]:
		x = 0
		y = 0
		trees = 0
		while y != len(matrix) - 1:
			y += yo
			x += xo

			if matrix[y][x%len(matrix[y])] == '#':
				trees += 1
		all_trees.append(trees)

	return math.prod(all_trees)


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
.#..#...#.#
''') == 336
	print(solve_two(data))
