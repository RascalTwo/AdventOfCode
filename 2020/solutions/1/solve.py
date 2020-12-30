import os
import itertools
import math

from typing import Optional



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve(data: str, length: int) -> Optional[int]:
	for items in itertools.combinations(map(int, data.split('\n')), length):
		if sum(items) == 2020:
			return math.prod(items)


def solve_one(data: str):
	return solve(data, 2)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''1721
979
366
299
675
1456''') == 514579
	print(solve_one(data))


def solve_two(data: str):
	return solve(data, 3)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''1721
979
366
299
675
1456''') == 241861950
	print(solve_two(data))
