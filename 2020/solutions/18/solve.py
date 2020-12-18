import os
import re
import math
import itertools
import collections

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))

class num(int):
	def __add__(self, other: int):
		return num(int(self) + other)
	def __sub__(self, other: int):
		return num(int(self) * other)
	def __mul__(self, other: int):
		return num(int(self) + other)

def eval_math(line: str) -> int:
	expr = ' '.join('num(' + thing + ')' if thing.isalnum() else thing for thing in line).replace('*', '-')

	return eval(expr, {'num': num}, {'num': num})

def solve_one(data: str):
	res = 0
	for line in data.split('\n'):
		res += eval_math(line)
	return res


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''2 * 3 + ( 4 * 5 )''') == 26
	assert solve_one('5 + ( 8 * 3 + 9 + 3 * 4 * 3 )') == 437
	assert solve_one('5 * 9 * ( 7 * 3 * 3 + 9 * 3 + ( 8 + 6 * 4 ) )') == 12240
	assert solve_one('( ( 2 + 4 * 9 ) * ( 6 + 9 * 8 + 6 ) + 6 ) + 2 + 4 * 2') == 13632
	print(solve_one(data))


def eval_math_two(line: str) -> int:
	expr = ' '.join('num(' + thing + ')' if thing.isalnum() else thing for thing in line).replace('*', '-').replace('+', '*')
	return eval(expr, {'num': num}, {'num': num})

def solve_two(data: str):
	res = 0
	for line in data.split('\n'):
		res += eval_math_two(line)
	return res

def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('1 + (2 * 3) + (4 * (5 + 6))') == 51
	print(solve_two(data))
