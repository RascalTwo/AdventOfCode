import os
import sys

from typing import Dict, Literal, Set, Union



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def flash(matrix: Dict[complex, int], flashed: Set[complex], loc: complex):
	flashed.add(loc)

	matrix[loc] = -1
	for ro in [-1, 0, 1]:
		for co in [-1, 0, 1]:
			if not ro and not co:
				continue

			new_loc = loc + complex(ro, co)
			if new_loc not in matrix:
				continue

			matrix[new_loc] += 1
			if matrix[new_loc] > 9:
				flash(matrix, flashed, new_loc)

def solve(data: str, mode: Union[Literal[1], Literal[2]]) -> int:
	matrix = {
		complex(r, c): int(col)
		for r, row in enumerate(data.strip().split('\n'))
		for c, col in enumerate(row)
	}

	flash_total = 0
	for step in range(1, 101 if mode == 1 else sys.maxsize):
		for loc, col in matrix.items():
			matrix[loc] += 1


		flashed: Set[complex] = set()
		for loc, col in matrix.items():
			if col > 9:
				flash(matrix, flashed, loc)

		for loc in flashed:
			matrix[loc] = 0


		if mode == 1:
			flash_total += len(flashed)
		elif len(flashed) == len(matrix):
			return step

	return flash_total


def solve_one(data: str):
	return solve(data, 1)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526''') == 1656
	print(solve_one(data))


def solve_two(data: str):
	return solve(data, 2)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526''') == 195
	print(solve_two(data))
