import os

from typing import Sequence


DIRPATH = os.path.dirname(os.path.abspath(__file__))


def min_and_max(sequence: Sequence[int]):
	least, most = sequence[0], sequence[0]

	for num in sequence[1:]:
		if num < least:
			least = num
		elif num > most:
			most = num

	return least, most + 1


def solve_one(data: str):
	nums = list(map(int, data.strip().split(',')))
	return min(sum(abs(num - target) for num in nums) for target in range(*min_and_max(nums)))


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('16,1,2,0,4,2,7,1,2,14') == 37
	print(solve_one(data))


def solve_two(data: str):
	def cost(distance: int):
		return distance * (distance + 1) // 2
	nums = list(map(int, data.strip().split(',')))
	return min(sum(cost(abs(num - target)) for num in nums) for target in range(*min_and_max(nums)))


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('16,1,2,0,4,2,7,1,2,14') == 168
	print(solve_two(data))
