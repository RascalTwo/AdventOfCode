import os
import re
import math
import itertools
import collections

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	matrix = []
	for row in data.strip().split('\n'):
		matrix.append(list(map(int, list(row))))
	
	count = 0
	def flash(r: int, c: int):
		matrix[r][c] = -1
		flashed[r, c] += 1
		#if flashed[r, c] > 1:
			#return
		for ro in [-1, 0, 1]:
			for co in [-1, 0, 1]:
				if not ro and not co:
					continue
				nr, nc = r + ro, c + co
				if nr < 0 or nc < 0 or nr >= len(matrix) or nc >= len(matrix[nr]):
					continue
				matrix[nr][nc] += 1
				if matrix[nr][nc] >= 10:
					flashed[nr, nc] = 10
					flash(nr, nc)

	flash_total = 0
	for _ in range(100):
		flashed = collections.defaultdict(int)
		for r, row in enumerate(matrix):
			for c, col in enumerate(row):
				row[c] += 1
		for r, row in enumerate(matrix):
			for c, col in enumerate(row):
				if col >= 10:
					flashed[r, c] = 10
					flash(r, c)
		for (r, c), count in flashed.items():
			if count > 10:
				matrix[r][c] = 0
			else:
				matrix[r][c] += count
		flash_total += len(flashed)
	return flash_total



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
	matrix = []
	for row in data.strip().split('\n'):
		matrix.append(list(map(int, list(row))))
	
	count = 0
	def flash(r: int, c: int):
		matrix[r][c] = -1
		flashed[r, c] += 1
		#if flashed[r, c] > 1:
			#return
		for ro in [-1, 0, 1]:
			for co in [-1, 0, 1]:
				if not ro and not co:
					continue
				nr, nc = r + ro, c + co
				if nr < 0 or nc < 0 or nr >= len(matrix) or nc >= len(matrix[nr]):
					continue
				matrix[nr][nc] += 1
				if matrix[nr][nc] >= 10:
					flashed[nr, nc] = 10
					flash(nr, nc)

	flash_total = 0
	for _ in range(1000):
		flashed = collections.defaultdict(int)
		for r, row in enumerate(matrix):
			for c, col in enumerate(row):
				row[c] += 1
		for r, row in enumerate(matrix):
			for c, col in enumerate(row):
				if col >= 10:
					flashed[r, c] = 10
					flash(r, c)
		for (r, c), count in flashed.items():
			if count > 10:
				matrix[r][c] = 0
			else:
				matrix[r][c] += count
		flash_total += len(flashed)
		if sum(count > 10 for count in flashed.values()) == len(matrix) * len(matrix[0]):
			return _ + 1


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
