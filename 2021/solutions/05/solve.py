import os
import math
import collections

from typing import Counter, Tuple


DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	world: Counter[Tuple[int, int]] = collections.Counter()

	for line in data.strip().split('\n'):
		start, end = [tuple(map(int, side.split(','))) for side in line.split(' -> ')]
		if start[0] == end[0] or start[1] == end[1]:
			for x in range(*((start[0], end[0] + 1) if start[0] < end[0] else (end[0], start[0] + 1))):
				for y in range(*((start[1], end[1] + 1) if start[1] < end[1] else (end[1], start[1] + 1))):
					world[x, y] += 1

	return sum(1 for value in world.values() if value > 1)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2''') == 5
	print(solve_one(data))


def solve_two(data: str):
	world: Counter[complex] = collections.Counter()

	for line in data.strip().split('\n'):
		start, end = [complex(*map(int, side.split(','))) for side in line.split(' -> ')]
		delta = complex(*(
			math.copysign(
				int(getattr(start, attrib) != getattr(end, attrib)),
				getattr(end, attrib) - getattr(start, attrib)
			)
			for attrib in ('real', 'imag')
		))
		current = start
		while current != end + delta:
			world[current] += 1
			current += delta

	return sum(1 for count in world.values() if count > 1)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2''') == 12
	print(solve_two(data))
