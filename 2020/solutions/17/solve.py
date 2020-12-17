import os
import re
import math
import itertools
import collections

from typing import Dict, List, Tuple, Set



DIRPATH = os.path.dirname(os.path.abspath(__file__))

Point = Tuple[int, int, int]

def get_neighbor_states(world: Dict[Point, str], z: int, x: int, y: int) -> List[str]:
	#orig_sum = x + z + y
	neighbors = []
	for zd in (-1, 0, 1):
		for xd in (-1, 0, 1):
			for yd in (-1, 0, 1):
				nz = z + zd
				nx = x + xd
				ny = y + yd
				if nx == x and ny == y and nz == z:
					continue
				neighbors.append(world.get((nz, nx, ny), '.'))
				#new_sum = nz + nx + ny
				#diff = abs(new_sum - orig_sum)
				#if diff == 1:
					#continue

	return neighbors

def solve_one(data: str):
	world: Dict[Point, str] = {}
	matrix: List[List[str]] = list(map(list, data.split('\n')))
	for x, row in enumerate(matrix):
		for y, col in enumerate(row):
			world[(0, x, y)] = col

	for _ in range(6):
		values = [[point[i] for point in world.keys()] for i in range(3)]
		next_world = world.copy()
		for z in range(min(values[0]) - 1, max(values[0]) + 2):
			for x in range(min(values[1]) - 1, max(values[1]) + 2):
				for y in range(min(values[2]) - 1, max(values[2]) + 2):
					neighbors = get_neighbor_states(world, z, x, y)
					active_n = neighbors.count('#')
					point = (z, x, y)
					current = world.get(point, '.')
					if current == '#':
						if active_n in (2, 3):
							next_world[point] = '#'
						else:
							next_world[point] = '.'
					else:
						if active_n == 3:
							next_world[point] = '#'
						else:
							next_world[point] = '.'
		world = next_world

	ac = 0
	for value in world.values():
		ac += value == '#'
	return ac



def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''.#.
..#
###''') == 112
	print(solve_one(data))


def get_neighbor_states_two(world: Dict[Point, str], w: int, z: int, x: int, y: int) -> List[str]:
	#orig_sum = x + z + y
	neighbors = []
	for wd in (-1, 0, 1):
		for zd in (-1, 0, 1):
			for xd in (-1, 0, 1):
				for yd in (-1, 0, 1):
					nw = w + wd
					nz = z + zd
					nx = x + xd
					ny = y + yd
					if nw == w and nz == z and nx == x and ny == y:
						continue
					neighbors.append(world.get((nw, nz, nx, ny), '.'))
					#new_sum = nz + nx + ny
					#diff = abs(new_sum - orig_sum)
					#if diff == 1:
						#continue

	return neighbors

def solve_two(data: str):
	world: Dict[Point, str] = {}
	matrix: List[List[str]] = list(map(list, data.split('\n')))
	for x, row in enumerate(matrix):
		for y, col in enumerate(row):
			world[(0, 0, x, y)] = col

	for _ in range(6):
		values = [[point[i] for point in world.keys()] for i in range(4)]
		next_world = world.copy()

		for w in range(min(values[0]) - 1, max(values[0]) + 2):
			for z in range(min(values[1]) - 1, max(values[1]) + 2):
				for x in range(min(values[2]) - 1, max(values[2]) + 2):
					for y in range(min(values[3]) - 1, max(values[3]) + 2):
						neighbors = get_neighbor_states_two(world, w, z, x, y)
						active_n = neighbors.count('#')
						point = (w, z, x, y)
						current = world.get(point, '.')
						if current == '#':
							if active_n in (2, 3):
								next_world[point] = '#'
							else:
								next_world[point] = '.'
						else:
							if active_n == 3:
								next_world[point] = '#'
							else:
								next_world[point] = '.'
		world = next_world

	ac = 0
	for value in world.values():
		ac += value == '#'
	return ac


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''.#.
..#
###''') == 848
	print(solve_two(data))
