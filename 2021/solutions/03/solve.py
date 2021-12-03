import os
import re
import math
import itertools
import collections

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	nums = list(map(str, data.strip().split('\n')))
	length = len(str(nums[0]))
	gamma = []
	epsilon = []
	for i in range(length):
		zeros = 0
		ones = 0
		for num in nums:
			num = str(num)
			if num[i] == '1':
				ones += 1
			else:
				zeros += 1
		if zeros > ones:
			gamma.append(0)
			epsilon.append(1)
		else:
			gamma.append(1)
			epsilon.append(0)

	gamma_num = int(''.join(map(str, gamma)), 2)
	epsilon_num = int(''.join(map(str, epsilon)), 2)
	return gamma_num * epsilon_num



def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010''') == 198
	print(solve_one(data))


def solve_two(data: str):
	nums = list(map(str, data.strip().split('\n')))
	length = len(str(nums[0]))
	gamma = []
	epsilon = []
	oxygen = None
	numbers = nums
	for i in range(length):
		if len(numbers) == 1:
			break
		zeros = 0
		ones = 0
		for num in numbers:
			num = str(num)
			if num[i] == '1':
				ones += 1
			else:
				zeros += 1

		keeping = []
		if ones >= zeros:
			for num in numbers:
				if num[i] == '1':
					keeping.append(num)
		else:
			for num in numbers:
				if num[i] == '0':
					keeping.append(num)
	
		numbers = keeping
	oxygen = numbers[0]
	co2 = None
	numbers = nums
	for i in range(length):
		if len(numbers) == 1:
			break
		zeros = 0
		ones = 0
		for num in numbers:
			num = str(num)
			if num[i] == '1':
				ones += 1
			else:
				zeros += 1

		keeping = []
		if zeros > ones:
			for num in numbers:
				if num[i] == '1':
					keeping.append(num)
		else:
			for num in numbers:
				if num[i] == '0':
					keeping.append(num)
	
		numbers = keeping
	co2 = numbers[0]

	oxygen = int(''.join(map(str, oxygen)), 2)
	co2 = int(''.join(map(str, co2)), 2)
	return oxygen * co2

def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010''') == 230
	print(solve_two(data))
