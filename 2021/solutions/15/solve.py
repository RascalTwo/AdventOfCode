import os
import sys
import heapq

from typing import Dict, List, Set, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def dijkstra(matrix: List[List[int]]) -> int:
	edges: Dict[Tuple[int, int], Set[Tuple[int, int]]] = {}
	risks: Dict[Tuple[int, int], int] = {}
	for r, row in enumerate(matrix):
		for c, weight in enumerate(row):
			loc = r, c

			risks[loc] = weight

			if loc not in edges:
				edges[loc] = set()
			for ro, co in [[0, 1], [0, -1], [1, 0], [-1, 0]]:
				nr, nc = r + ro, c + co
				if nr < 0 or nc < 0 or nr >= len(matrix) or nc >= len(matrix[0]):
					continue
				edges[loc].add((nr, nc))

	start = (0, 0)
	distances = {node: sys.maxsize for node in edges}
	distances[start] = 0

	pq: List[Tuple[int, Tuple[int, int]]] = [(0, start)]
	while pq:
		distance, current = heapq.heappop(pq)
		for neighbor in edges[current]:
			if (new_dist := distance + risks[neighbor]) < distances[neighbor]:
				distances[neighbor] = new_dist
				heapq.heappush(pq, (new_dist, neighbor))

	return distances[len(matrix) - 1, len(matrix[0]) - 1]


def solve_one(data: str):
	return dijkstra([list(map(int, row)) for row in data.strip().split('\n')])


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581''') == 40
	print(solve_one(data))


def solve_two(data: str):
	matrix = [list(map(int, row)) for row in data.strip().split('\n')]

	height = len(matrix)
	width = len(matrix[0])

	for row in matrix:
		for chunk in range(4):
			row += [((col + 1) % 10) or 1 for col in row[width * chunk:]]

	for chunk in range(4):
		for row in matrix[height * chunk:]:
			matrix.append([((col + 1) % 10) or 1 for col in row])

	return dijkstra(matrix)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581''') == 315
	print(solve_two(data))
