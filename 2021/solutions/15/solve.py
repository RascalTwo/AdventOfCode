import os
import re
import math
import itertools
import collections

from typing import Dict, List, Set, SupportsRound, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def dijkstra(matrix: List[List[int]]) -> int:
	edges: Dict[Tuple[int, int], Set[Tuple[int, int]]] = {}
	risks = {}
	for r, row in enumerate(matrix):
		for c, weight in enumerate(row):
			risks[(r, c)] = weight
			if (r, c) not in edges:
				edges[(r, c)] = set()
			for ro, co in [[0, 1], [0, -1], [1, 0], [-1, 0]]:
				nr, nc = r + ro, c + co
				if nr < 0 or nc < 0 or nr >= len(matrix) or nc >= len(matrix[0]):
					continue
				edges[(r, c)].add((nr, nc))
	import sys
	import heapq
	current = (0, 0)
	distances = {node: sys.maxsize for node in edges}
	distances[current] = 0
	goal = (len(matrix) - 1, len(matrix[0]) - 1)

	pq = [(0, current)]
	while pq:
		dist, current = heapq.heappop(pq)
		for neighbor in edges[current]:
			ndist = dist + risks[neighbor]
			if ndist < distances[neighbor]:
				distances[neighbor] = ndist
				heapq.heappush(pq, (ndist, neighbor))
		if distances[goal] != sys.maxsize:
			return distances[goal]

	return distances[goal]

def solve_one(data: str):
	matrix = [list(map(int, row)) for row in data.strip().split('\n')]
	return dijkstra(matrix)


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
	for row in matrix:
		length = len(row)
		for _ in range(4):
			for col in row[length * _:]:
				nv = (col + 1) % 10
				if not nv:
					nv = 1
				row.append(nv)

	length = len(matrix)
	for _ in range(4):
		for row in matrix[length * _:]:
			new_row = []
			for col in row:
				nv = (col + 1) % 10
				if not nv:
					nv = 1
				new_row.append(nv)
			matrix.append(new_row)
	return dijkstra(matrix)

def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	"""assert solve_two('''1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581''') == 315"""
	print(solve_two(data))
