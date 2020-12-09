import os
from typing import List
import itertools

DIRPATH = os.path.dirname(os.path.abspath(__file__))


def is_good(preamble_length, index, target: int, nums: List[int]):
	for a, b in itertools.combinations(nums[index-preamble_length:index], 2):
		if a + b == target:
			return True
	return False

def solve_one(data: str, preamble_length: int):
	nums = list(map(int, data.split('\n')))
	for i, num in enumerate(nums):
		if i < preamble_length:
			continue
		if not is_good(preamble_length, i, num, nums):
			return num


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576''', 5) == 127
	print(solve_one(data, 25))


def solve_two(data: str, preamble_length: int):
	nums = list(map(int, data.split('\n')))
	found = None
	for i, num in enumerate(nums):
		if i < preamble_length:
			continue
		if not is_good(preamble_length, i, num, nums):
			found = num
			break
	for i in range(len(nums)):
		for j in range(i, len(nums)):
			if i == j:
				continue
			if sum(nums[i:j]) != found:
				continue
			fnums = sorted(nums[i:j])
			return fnums[0] + fnums[-1]


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576''', 5) == 62
	print(solve_two(data, 25))
