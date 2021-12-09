import os
import math

from typing import Dict, List, Set, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


Matrix = Dict[complex, int]


def parse_matrix(data: str) -> Matrix:
	return {
		complex(r, c): int(col)
		for r, row in enumerate(data.strip().split('\n'))
		for c, col in enumerate(row)
	}


def is_low(matrix: Matrix, coordinate: complex) -> bool:
	current = matrix[coordinate]

	for offset in (complex(0, 1), complex(0, -1), complex(-1, 0), complex(1, 0)):
		trying = coordinate + offset
		if trying in matrix and current >= matrix[trying]:
			return False

	return True


def solve_one(data: str):
	matrix = parse_matrix(data)
	return sum(1 + matrix[coordinate] for coordinate in matrix if is_low(matrix, coordinate))


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''2199943210
3987894921
9856789892
8767896789
9899965678''') == 15
	print(solve_one(data))


def flood_basin(matrix: Matrix, basin: List[complex]) -> int:
	coordinate = basin[-1]
	for offset in (complex(0, 1), complex(0, -1), complex(-1, 0), complex(1, 0)):
		trying = coordinate + offset
		if trying not in basin and trying in matrix and matrix[trying] < 9:
			basin.append(trying)
			flood_basin(matrix, basin)

	return len(basin)


def solve_two(data: str):
	matrix = parse_matrix(data)
	return math.prod(sorted((
		flood_basin(matrix, [low_point])
		for low_point in (
			coordinate
			for coordinate in matrix
			if is_low(matrix, coordinate)
		)
	), reverse=True)[:3])


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''2199943210
3987894921
9856789892
8767896789
9899965678''') == 1134
	print(solve_two(data))
