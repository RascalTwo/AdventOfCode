import os
import re
import math
import itertools
import collections

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def find_loop_num(subject: int, target: int, mod: int) -> int:
	for loop in range(1000000000):
		if pow(subject, loop, mod) == target:
			return loop


def solve_one(data: str):
	card, door = list(map(int, data.split('\n')))
	dl = find_loop_num(7, door, 20201227)

	return pow(card, dl, 20201227)

def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''5764801
17807724''') == 14897079
	print(solve_one(data))
