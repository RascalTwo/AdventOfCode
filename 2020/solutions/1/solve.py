import itertools
import math
from typing import Optional

def solve(data: str, length: int) -> Optional[int]:
	for items in itertools.combinations(map(int, data.split('\n')), length):
		if sum(items) == 2020:
			return math.prod(items)

def solve_one(data: str):
	return solve(data, 2)

def solve_two(data: str):
	return solve(data, 3)


with open('input.in') as input_file:
	data = input_file.read()

def test_one():
	assert solve_one('''1721
979
366
299
675
1456''') == 514579
	print(solve_one(data))

def test_two():
	assert solve_two('''1721
979
366
299
675
1456''') == 241861950
	print(solve_two(data))
