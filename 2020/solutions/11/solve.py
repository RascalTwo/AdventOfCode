import os
import itertools

from typing import Callable, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def find_visible_target(matrix: Tuple[Tuple[str]], x: int, y: int, search_distance: int, stopper: Callable[[List[str]], bool] = lambda _: False) -> bool:
	visible = []
	for xo, yo in itertools.product((-1, 0, 1), repeat=2):
		if xo == yo == 0:
			continue

		for i in range(1, search_distance + 1):
			nx = x + (i * xo)
			ny = y + (i * yo)
			if nx < 0 or nx >= len(matrix) or ny < 0 or ny >= len(matrix[x]):
				break

			current = matrix[nx][ny]
			if current == '.':
				continue
			visible += current
			if stopper(visible):
				return True
			break

	return False


def process_matrix(matrix: Tuple[Tuple[str]], search_distance: int, occ_empty_max: int) -> Tuple[Tuple[str]]:
	return tuple(
		tuple(
			('L' if find_visible_target(
				matrix, x, y, search_distance,
				(lambda visible: '#' in visible)
				if current == 'L' else
				(lambda visible: visible.count('#') == occ_empty_max)
			) else '#') if current != '.' else '.'
			for y, current in enumerate(row)
		)
		for x, row in enumerate(matrix)
	)


def solve(data: str, search_distance: int, occ_empty_max: int) -> int:
	matrix: Tuple[Tuple[str]] = tuple(map(tuple, data.split('\n')))

	while True:
		new_matrix = process_matrix(matrix, search_distance, occ_empty_max)
		if new_matrix == matrix:
			break
		matrix = new_matrix

	return sum(row.count('#') for row in matrix)


def solve_one(data: str):
	return solve(data, 1, 4)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL''') == 37
	print(solve_one(data))


def solve_two(data: str):
	rows = data.split('\n')
	return solve(data, max(len(rows), len(rows[0])), 5)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL''') == 26
	print(solve_two(data))
