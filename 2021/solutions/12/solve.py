import os
import collections

from typing import DefaultDict, List, Set, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))
def solve(data: str, small_revisits: int):
	small_caves: Set[str] = set()

	edges: DefaultDict[str, Set[str]] = collections.defaultdict(set)
	for origin, dest in (edge.split('-') for edge in data.strip().split('\n')):
		edges[origin].add(dest)
		edges[dest].add(origin)

		for cave in (origin, dest):
			if cave not in ('start', 'end') and cave.islower():
				small_caves.add(cave)

	paths = 0

	stack: List[Tuple[Set[str], str, DefaultDict[str, int], Set[str]]] = [(set(), 'start', collections.defaultdict(int), set())]
	while stack:
		path, current, smalls, can_revisit = stack.pop()

		if current in small_caves:
			smalls[current] += 1
			getattr(can_revisit, 'add' if smalls[current] == 1 else 'remove')(current)
			if len(smalls) - len(can_revisit) >= small_revisits:
				can_revisit.clear()

		for dest in edges[current]:
			# If is small cave that has been visited, but cannot revisit
			if dest == 'start' or (dest not in can_revisit and dest in small_caves and dest in path):
				continue
			if dest == 'end':
				paths += 1
			else:
				stack.append((path | {current}, dest, smalls.copy(), can_revisit.copy()))

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
