import os

from typing import List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	matrix = []
	for line in data.strip().split('\n'):
		matrix.append(list(map(int, list(line))))
	def is_low(r: int, c: int) -> bool:
		current = matrix[r][c]
		offsets = [(0, 1), (0, -1), (-1, 0), (1, 0)]
		for ro, co in offsets:
			nr, nc = r + ro, c + co
			if nr < 0 or nc < 0 or nr >= len(matrix) or nc >= len(matrix[nr]):
				continue
			other = matrix[nr][nc]
			if current >= other:
				return False
		return True
	risk = 0
	for r, row in enumerate(matrix):
		for c, col in enumerate(row):
			if is_low(r, c):
				risk += 1 + col
	return risk


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''2199943210
3987894921
9856789892
8767896789
9899965678''') == 15
	print(solve_one(data))


def solve_two(data: str):
	matrix = []
	for line in data.strip().split('\n'):
		matrix.append(list(map(int, list(line))))
	def is_low(r: int, c: int) -> bool:
		current = matrix[r][c]
		offsets = [(0, 1), (0, -1), (-1, 0), (1, 0)]
		for ro, co in offsets:
			nr, nc = r + ro, c + co
			if nr < 0 or nc < 0 or nr >= len(matrix) or nc >= len(matrix[nr]):
				continue
			other = matrix[nr][nc]
			if current >= other:
				return False
		return True
	lowpoints = []
	for r, row in enumerate(matrix):
		for c, col in enumerate(row):
			if is_low(r, c):
				lowpoints.append((r, c))
	def find_basin(lr: int, lc: int) -> List[Tuple[int, int]]:
		basin = []
		processing = [(lr, lc)]
		while processing:
			r, c = processing.pop()
			basin.append((r, c))
			for ro, co in [(0, 1), (0, -1), (-1, 0), (1, 0)]:
				nr, nc = r + ro, c + co
				if (nr, nc) in basin:
					continue
				if nr < 0 or nc < 0 or nr >= len(matrix) or nc >= len(matrix[nr]):
					continue
				other = matrix[nr][nc]
				if other < 9:
					processing.append((nr, nc))
		return set(basin)

	basins = []
	for lowpoint in lowpoints:
		basins.append(find_basin(*lowpoint))
	basins.sort(key = lambda basin: len(basin), reverse=True)
	result = None
	for basin in basins[:3]:
		if result is None:
			result = len(basin)
		else:
			result *= len(basin)
	return result


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''2199943210
3987894921
9856789892
8767896789
9899965678''') == 1134
	print(solve_two(data))
