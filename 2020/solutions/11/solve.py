import os
import re
import math
import itertools
import copy

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def get_one_neighbors(matrix: List[List[str]], x: int, y: int) -> List[str]:
	offsets = [
		(-1, -1), (-1, 0), (-1, 1),
		(0, -1),           (0, 1),
		(1, -1), (1, 0), (1, 1),
	]
	ns = []
	for xo, yo in offsets:
		nx = x + xo
		ny = y + yo
		if nx < 0 or nx >= len(matrix) or ny < 0 or ny >= len(matrix[x]):
			continue
		ns.append(matrix[nx][ny])
	return [n for n in ns if n is not None]

def process_one_matrix(matrix: List[List[str]]):
	new_matrix = copy.deepcopy(matrix)
	for x in range(len(matrix)):
		for y in range(len(matrix[x])):
			if matrix[x][y] == '.':
				continue
			ns = get_one_neighbors(matrix, x, y)
			if '#' not in ns:
				new_matrix[x][y] = '#'
				continue
			occ_count = ns.count('#')
			if occ_count >= 4:
				new_matrix[x][y] = 'L'
				continue
	return new_matrix

def count_occupied(matrix: List[List[str]]) -> int:
	count = 0
	for row in matrix:
		count += row.count('#')
	return count

def solve_one(data: str):
	matrix = list(map(list, data.split('\n')))
	last_state = copy.deepcopy(matrix)
	first = True
	while matrix != last_state or first:
		if first:
			first = False

		last_state = copy.deepcopy(matrix)
		matrix = process_one_matrix(copy.deepcopy(matrix))

	return count_occupied(matrix)


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

def get_neighbors(matrix: List[List[str]], x: int, y: int) -> List[str]:
	offsets = [
		(-1, -1), (-1, 0), (-1, 1),
		(0, -1),           (0, 1),
		(1, -1), (1, 0), (1, 1),
	]
	ns = []
	for xo, yo in offsets:
		for i in range(1000000):
			nx = x + xo + (i * xo)
			ny = y + yo + (i * yo)
			if nx < 0 or nx >= len(matrix) or ny < 0 or ny >= len(matrix[x]):
				break
			ns.append(matrix[nx][ny])
			if ns[-1] != '.':
				break
	return [n for n in ns if n is not None]

def test_gn():
	get_neighbors(list(map(list, '''.......#.
...#.....
.#.......
.........
..#L....#
....#....
.........
#........
...#.....'''.split('\n'))), 4, 3)
	#print(ns)
test_gn()

def process_matrix(matrix: List[List[str]]):
	new_matrix = copy.deepcopy(matrix)
	for x in range(len(matrix)):
		for y in range(len(matrix[x])):
			if matrix[x][y] == '.':
				continue
			ns = get_neighbors(matrix, x, y)
			if '#' not in ns:
				new_matrix[x][y] = '#'
				continue
			occ_count = ns.count('#')
			if occ_count >= 5:
				new_matrix[x][y] = 'L'
				continue
	return new_matrix

def solve_two(data: str):
	matrix = list(map(list, data.split('\n')))
	last_state = copy.deepcopy(matrix)
	first = True
	while matrix != last_state or first:
		if first:
			first = False

		last_state = copy.deepcopy(matrix)
		matrix = process_matrix(copy.deepcopy(matrix))

	return count_occupied(matrix)


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
test_two()