import os
import collections


from typing import DefaultDict



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve(data: str, target: int) -> int:
	starting = [-1] + list(map(int, data.split(',')))

	nums_to_turns: DefaultDict[int, collections.deque[int]] = collections.defaultdict(lambda: collections.deque(maxlen=2), {
		starting[turn]: collections.deque([turn], maxlen=2)
		for turn in range(1, len(starting))
	})

	spoken: int = starting[-1]
	for turn in range(len(starting), target + 1):
		if len(nums_to_turns[spoken]) == 1:
			spoken = 0
		else:
			deque = nums_to_turns[spoken]
			spoken = deque[-1] - deque[0]

		nums_to_turns[spoken].append(turn)

	return spoken


def solve_one(data: str):
	return solve(data, 2020)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''0,3,6''') == 436
	print(solve_one(data))


def solve_two(data: str):
	return solve(data, 30000000)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''0,3,6''') == 175594
	print(solve_two(data))
