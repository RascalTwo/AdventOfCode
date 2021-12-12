import os
import collections



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	edges = [edge.split('-') for edge in data.strip().split('\n')]
	for a, b in edges[:]:
		edges.append([b, a])

	processing = []
	for a, b in edges:
		if a != 'start':
			continue
		processing.append([a, b])
	paths = []
	while processing:
		path = processing.pop()
		#caves = [place for place in path if place not in ['start', 'end']]
		current = path[-1]
		if current == 'end':
			paths.append(path)
			continue
		for a, b in edges:
			if a != current:
				continue
			if b in path and b.islower():
				continue
			processing.append([*path, b])
	return len(paths)


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
	edges = [edge.split('-') for edge in data.strip().split('\n')]
	for a, b in edges[:]:
		edges.append([b, a])

	processing = []
	for a, b in edges:
		if a != 'start':
			continue
		processing.append([a, b])
	paths = []
	while processing:
		path = processing.pop()
		#caves = [place for place in path if place not in ['start', 'end']]
		current = path[-1]
		if current == 'end':
			paths.append(path)
			continue
		has_doubled_small = False
		smalls = collections.defaultdict(int)
		for cave in path:
			if cave.islower():
				smalls[cave] += 1
		has_doubled_small = any(count == 2 for count in smalls.values())
		for a, b in edges:
			if a != current:
				continue
			if b in path and b.islower() and has_doubled_small:
				continue
			if b == 'start':
				continue
			processing.append([*path, b])
	return len(paths)


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
	print(solve_two(data))
