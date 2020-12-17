import os
import itertools

from typing import Dict, Iterator, List, Tuple, cast



DIRPATH = os.path.dirname(os.path.abspath(__file__))


Point = Tuple[int, ...]


def get_neighbor_coords(point: Point) -> Iterator[Point]:
	return (
		new_point
		for offset in itertools.product((-1, 0, 1), repeat=len(point))
		if (new_point := tuple(point[i] + offset[i] for i in range(len(point)))) != point
	)


def parse_input(data: str, dimensions: int) -> Dict[Point, str]:
	return {
		(*(0, ) * (dimensions - 2), x, y): col
		for x, row in enumerate(cast(List[List[str]], list(map(list, data.split('\n')))))  # type: ignore
		for y, col in enumerate(row)
	}


def solve(data: str, dimensions: int):
	world = parse_input(data, dimensions)

	for _ in range(6):
		next_world = world.copy()

		values = [[point[i] for point in world.keys()] for i in range(dimensions)]
		for point in itertools.product(
			*(range(min(values[i]) - 1, max(values[i]) + 2) for i in range(dimensions))
		):
			active = sum(world.get(neighbor, '.') == '#' for neighbor in get_neighbor_coords(point))
			current = world.get(point, '.')
			if current == '#' and active not in (2, 3):
				next_world[point] = '.'
			elif current == '.' and active == 3:
				next_world[point] = '#'

		world = next_world

	return sum(value == '#' for value in world.values())


def solve_one(data: str):
	return solve(data, 3)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''.#.
..#
###''') == 112
	print(solve_one(data))


def solve_two(data: str):
	return solve(data, 4)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''.#.
..#
###''') == 848
	print(solve_two(data))
