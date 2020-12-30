import os
import functools



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	return sum(len(set(group.replace('\n', ''))) for group in data.split('\n\n'))


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''abc

a
b
c

ab
ac

a
a
a
a

b''') == 11
	print(solve_one(data))


def solve_two(data: str):
	return sum(len(
		functools.reduce(
			lambda a, b: a & b,
			map(set, group.split('\n')),
			set(group.replace('\n', ''))
		)
	) for group in data.split('\n\n'))


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''abc

a
b
c

ab
ac

a
a
a
a

b''') == 6
	print(solve_two(data))
