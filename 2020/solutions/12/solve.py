import os

from typing import Iterator, MutableSequence, Sequence, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


DIRECTIONS = {
	'N': (0, 1),
	'E': (1, 0),
	'S': (0, -1),
	'W': (-1, 0),
}


def parse_commands(data: str) -> Iterator[Tuple[str, int]]:
	return map(lambda line: (line[0], int(line[1:])), data.split('\n'))


def add_sequences(one: MutableSequence[int], two: Sequence[int], multiple: int = 1):
	for i in range(len(one)):
		one[i] += two[i] * multiple


def solve_one(data: str) -> int:
	ROTATIONS = list(DIRECTIONS.keys())

	ship = [0, 0]
	direction = 'E'

	for command, argument in parse_commands(data):
		if command in DIRECTIONS or command == 'F':
			add_sequences(ship, DIRECTIONS[direction if command == 'F' else command], argument)
		elif command in 'LR':
			direction = ROTATIONS[
				(ROTATIONS.index(direction) + (argument // 90) * (-1 if command == 'L' else 1)) % len(ROTATIONS)
			]

	return sum(map(abs, ship))


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''F10
N3
F7
R90
F11''') == 25
	print(solve_one(data))


def solve_two(data: str) -> int:
	ship = [0, 0]
	waypoint = [10, 1]

	for command, argument in parse_commands(data):
		if command == 'F':
			add_sequences(ship, waypoint, argument)
		elif command in DIRECTIONS:
			add_sequences(waypoint, DIRECTIONS[command], argument)
		elif command in 'LR':
			flipping_index = int(command == 'R')
			for _ in range(0, argument, 90):
				waypoint.reverse()
				waypoint[flipping_index] *= -1

	return sum(map(abs, ship))


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''F10
N3
F7
R90
F11''') == 286
	print(solve_two(data))
