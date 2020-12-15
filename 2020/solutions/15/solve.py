import os
import re
import math
import itertools
import collections

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))



def solve_one(data: str):
	starting = list(map(int, data.split(',')))
	turns_to_nums = {}
	nums_to_turns = collections.defaultdict(lambda: [])
	turn = -1
	while turn != 2020:
		turn += 1
		if turn < len(starting):
			speaking = starting[turn]
			turns_to_nums[turn] = speaking
			nums_to_turns[speaking].append(turn)
			continue

		last_spoken = turns_to_nums[turn-1]
		if len(nums_to_turns[last_spoken]) == 1:
			speaking = 0
			turns_to_nums[turn] = speaking
			nums_to_turns[speaking].append(turn)
			continue

		latest, second_latest = list(map(lambda n: n + 1, nums_to_turns[last_spoken][-2:][::-1]))
		speaking = latest - second_latest
		turns_to_nums[turn] = speaking
		nums_to_turns[speaking].append(turn)

	return turns_to_nums[2019]


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''0,3,6''') == 436
	print(solve_one(data))


def solve_two(data: str):
	starting = list(map(int, data.split(',')))
	turns_to_nums = {}
	nums_to_turns = collections.defaultdict(lambda: [])
	turn = -1
	while turn != 30000000:
		turn += 1
		if turn < len(starting):
			speaking = starting[turn]
			turns_to_nums[turn] = speaking
			nums_to_turns[speaking].append(turn)
			continue

		last_spoken = turns_to_nums[turn-1]
		if len(nums_to_turns[last_spoken]) == 1:
			speaking = 0
			turns_to_nums[turn] = speaking
			nums_to_turns[speaking].append(turn)
			continue

		latest, second_latest = list(map(lambda n: n + 1, nums_to_turns[last_spoken][-2:][::-1]))
		speaking = latest - second_latest
		turns_to_nums[turn] = speaking
		nums_to_turns[speaking].append(turn)

	return turns_to_nums[30000000-1]


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''0,3,6''') == 175594
	print(solve_two(data))
