import os
import collections

from typing import DefaultDict, Set



DIRPATH = os.path.dirname(os.path.abspath(__file__))

def solve(data: str, small_revisits: int):
	edges: DefaultDict[str, Set[str]] = collections.defaultdict(set)
	for origin, dest in (edge.split('-') for edge in data.strip().split('\n')):
		edges[origin].add(dest)
		edges[dest].add(origin)

	paths = 0

	processing = [['start']]
	while processing:
		path = processing.pop()
		current = path[-1]
		if current == 'end':
			continue

		can_revisit_small = False
		smalls: DefaultDict[str, int] = collections.defaultdict(int)
		for cave in path[1:]:
			if cave.islower():
				smalls[cave] += 1
		can_revisit_small = sum(count == 2 for count in smalls.values()) < small_revisits
		can_revisit: Set[str] = set((small for small, count in smalls.items() if count == 1) if can_revisit_small else ())

		for dest in edges[current]:
			if dest == 'start' or (dest in path and dest.islower() and dest not in can_revisit):
				continue
			if dest == 'end':
				paths += 1
			else:
				processing.append([*path, dest])
	return paths


def solve_one(data: str):
	return solve(data, 0)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''start-A
start-b
A-c
A-b
b-d
A-end
b-end''') == 10
	print(solve_one(data))


def solve_two(data: str):
	return solve(data, 1)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''start-A
start-b
A-c
A-b
b-d
A-end
b-end''') == 36
	assert solve('''start-A
A-b
A-z
A-end''', 2) == 19
	print(solve_two(data))
