import os
import collections

from typing import DefaultDict, List



DIRPATH = os.path.dirname(os.path.abspath(__file__))

def solve(data: str, target: int) -> int:
	def speak(value: int):
		nonlocal last_spoken
		last_spoken = value
		nums_to_turns[value].append(turn)

	starting = list(map(int, data.split(',')))

	last_spoken = 0
	nums_to_turns: DefaultDict[int, List[int]] = collections.defaultdict(list)

	turn = 0
	while turn != target:
		turn += 1
		if turn <= len(starting):
			speak(starting[turn-1])
			continue

		if len(nums_to_turns[last_spoken]) == 1:
			speak(0)
			continue

		latest, second_latest = nums_to_turns[last_spoken][-2:][::-1]
		speak(latest - second_latest)

	return last_spoken


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
