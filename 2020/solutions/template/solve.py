import os
import re
import math
import itertools
import collections

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	return True


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''

''') == True
	print(solve_one(data))


def solve_two(data: str):
	return 'false'


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''

''') == 'false'
	print(solve_two(data))
